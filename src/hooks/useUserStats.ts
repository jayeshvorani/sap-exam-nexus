
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserStats {
  examsCompleted: number;
  practiceExamsCompleted: number;
  realExamsCompleted: number;
  totalStudyTime: number;
  practiceStudyTime: number;
  realStudyTime: number;
  averageScore: number;
  practiceAverageScore: number;
  realAverageScore: number;
  practiceSuccessRate: number;
  realSuccessRate: number;
  overallSuccessRate: number;
  certificationsEarned: number;
  recentAttempts: Array<{
    id: string;
    exam_title: string;
    score: number;
    passed: boolean;
    completed_at: string;
    is_practice_mode: boolean;
  }>;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    examsCompleted: 0,
    practiceExamsCompleted: 0,
    realExamsCompleted: 0,
    totalStudyTime: 0,
    practiceStudyTime: 0,
    realStudyTime: 0,
    averageScore: 0,
    practiceAverageScore: 0,
    realAverageScore: 0,
    practiceSuccessRate: 0,
    realSuccessRate: 0,
    overallSuccessRate: 0,
    certificationsEarned: 0,
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

      // Separate practice and real exams
      const practiceAttempts = completedAttempts.filter(attempt => attempt.is_practice_mode);
      const realAttempts = completedAttempts.filter(attempt => !attempt.is_practice_mode);

      // Calculate basic counts
      const examsCompleted = completedAttempts.length;
      const practiceExamsCompleted = practiceAttempts.length;
      const realExamsCompleted = realAttempts.length;

      // Calculate average scores
      const totalScore = completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const averageScore = examsCompleted > 0 ? Math.round(totalScore / examsCompleted) : 0;

      const practiceScore = practiceAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const practiceAverageScore = practiceExamsCompleted > 0 ? Math.round(practiceScore / practiceExamsCompleted) : 0;

      const realScore = realAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const realAverageScore = realExamsCompleted > 0 ? Math.round(realScore / realExamsCompleted) : 0;

      // Calculate success rates
      const practicePassedCount = practiceAttempts.filter(attempt => attempt.passed).length;
      const practiceSuccessRate = practiceExamsCompleted > 0 ? Math.round((practicePassedCount / practiceExamsCompleted) * 100) : 0;

      const realPassedCount = realAttempts.filter(attempt => attempt.passed).length;
      const realSuccessRate = realExamsCompleted > 0 ? Math.round((realPassedCount / realExamsCompleted) * 100) : 0;

      const totalPassedCount = completedAttempts.filter(attempt => attempt.passed).length;
      const overallSuccessRate = examsCompleted > 0 ? Math.round((totalPassedCount / examsCompleted) * 100) : 0;

      // Certifications earned - only count successful real exams
      const certificationsEarned = realPassedCount;

      // Calculate study times
      const calculateStudyTime = (attempts: any[]) => {
        return attempts.reduce((total, attempt) => {
          if (attempt.start_time && attempt.end_time) {
            const startTime = new Date(attempt.start_time).getTime();
            const endTime = new Date(attempt.end_time).getTime();
            const durationHours = (endTime - startTime) / (1000 * 60 * 60);
            return total + durationHours;
          }
          return total;
        }, 0);
      };

      const practiceStudyTime = calculateStudyTime(practiceAttempts);
      const realStudyTime = calculateStudyTime(realAttempts);
      const totalStudyTime = practiceStudyTime + realStudyTime;

      // Recent attempts for display
      const recentAttempts = completedAttempts.slice(0, 5).map(attempt => ({
        id: attempt.id,
        exam_title: (attempt.exams as any)?.title || 'Unknown Exam',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completed_at: attempt.end_time || attempt.created_at,
        is_practice_mode: attempt.is_practice_mode
      }));

      setStats({
        examsCompleted,
        practiceExamsCompleted,
        realExamsCompleted,
        totalStudyTime: Math.round(totalStudyTime * 10) / 10,
        practiceStudyTime: Math.round(practiceStudyTime * 10) / 10,
        realStudyTime: Math.round(realStudyTime * 10) / 10,
        averageScore,
        practiceAverageScore,
        realAverageScore,
        practiceSuccessRate,
        realSuccessRate,
        overallSuccessRate,
        certificationsEarned,
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
