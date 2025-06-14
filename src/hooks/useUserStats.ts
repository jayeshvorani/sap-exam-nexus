
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserStats {
  examsCompleted: number;
  totalStudyTime: number;
  averageScore: number;
  recentAttempts: Array<{
    id: string;
    exam_title: string;
    score: number;
    passed: boolean;
    completed_at: string;
  }>;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    examsCompleted: 0,
    totalStudyTime: 0,
    averageScore: 0,
    recentAttempts: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Get completed exam attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select(`
          *,
          exams (
            title
          )
        `)
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('end_time', { ascending: false });

      if (attemptsError) throw attemptsError;

      const completedAttempts = attempts || [];

      // Calculate stats
      const examsCompleted = completedAttempts.length;
      const totalScore = completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const averageScore = examsCompleted > 0 ? Math.round(totalScore / examsCompleted) : 0;

      // Calculate total study time (rough estimate based on exam durations)
      const totalStudyTime = completedAttempts.reduce((total, attempt) => {
        if (attempt.start_time && attempt.end_time) {
          const startTime = new Date(attempt.start_time).getTime();
          const endTime = new Date(attempt.end_time).getTime();
          const durationHours = (endTime - startTime) / (1000 * 60 * 60);
          return total + durationHours;
        }
        return total;
      }, 0);

      // Recent attempts for display
      const recentAttempts = completedAttempts.slice(0, 5).map(attempt => ({
        id: attempt.id,
        exam_title: (attempt.exams as any)?.title || 'Unknown Exam',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completed_at: attempt.end_time || attempt.created_at
      }));

      setStats({
        examsCompleted,
        totalStudyTime: Math.round(totalStudyTime * 10) / 10, // Round to 1 decimal
        averageScore,
        recentAttempts
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchUserStats };
};
