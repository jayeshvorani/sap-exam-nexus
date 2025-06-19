
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { use Auth } from '@/hooks/useAuth';

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
  practiceExamsCompleted?: number;
  practiceStudyTime?: number;
  practiceAverageScore?: number;
  practiceSuccessRate?: number;
  realExamsCompleted?: number;
  realStudyTime?: number;
  realAverageScore?: number;
  realSuccessRate?: number;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    examsCompleted: 0,
    totalStudyTime: 0,
    averageScore: 0,
    recentAttempts: [],
    practiceExamsCompleted: 0,
    practiceStudyTime: 0,
    practiceAverageScore: 0,
    practiceSuccessRate: 0,
    realExamsCompleted: 0,
    realStudyTime: 0,
    realAverageScore: 0,
    realSuccessRate: 0
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
      // Get statistics from the new view
      const { data: statsData, error: statsError } = await supabase
        .from('user_exam_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      // Get recent attempts for display
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
        .order('end_time', { ascending: false })
        .limit(5);

      if (attemptsError) throw attemptsError;

      const completedAttempts = attempts || [];

      // Map recent attempts
      const recentAttempts = completedAttempts.map(attempt => ({
        id: attempt.id,
        exam_title: (attempt.exams as any)?.title || 'Unknown Exam',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completed_at: attempt.end_time || attempt.created_at
      }));

      // Calculate success rates
      const practiceSuccessRate = statsData?.practice_total_count > 0 
        ? Math.round((statsData.practice_passed_count / statsData.practice_total_count) * 100)
        : 0;

      const realSuccessRate = statsData?.real_total_count > 0 
        ? Math.round((statsData.real_passed_count / statsData.real_total_count) * 100)
        : 0;

      // Set comprehensive stats
      setStats({
        examsCompleted: (statsData?.practice_exams_completed || 0) + (statsData?.real_exams_completed || 0),
        totalStudyTime: Math.round(((statsData?.practice_study_time_hours || 0) + (statsData?.real_study_time_hours || 0)) * 10) / 10,
        averageScore: statsData?.practice_exams_completed || statsData?.real_exams_completed 
          ? Math.round(((statsData?.practice_average_score || 0) + (statsData?.real_average_score || 0)) / 2)
          : 0,
        recentAttempts,
        practiceExamsCompleted: statsData?.practice_exams_completed || 0,
        practiceStudyTime: Math.round((statsData?.practice_study_time_hours || 0) * 10) / 10,
        practiceAverageScore: Math.round(statsData?.practice_average_score || 0),
        practiceSuccessRate,
        realExamsCompleted: statsData?.real_exams_completed || 0,
        realStudyTime: Math.round((statsData?.real_study_time_hours || 0) * 10) / 10,
        realAverageScore: Math.round(statsData?.real_average_score || 0),
        realSuccessRate
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Set default values on error
      setStats({
        examsCompleted: 0,
        totalStudyTime: 0,
        averageScore: 0,
        recentAttempts: [],
        practiceExamsCompleted: 0,
        practiceStudyTime: 0,
        practiceAverageScore: 0,
        practiceSuccessRate: 0,
        realExamsCompleted: 0,
        realStudyTime: 0,
        realAverageScore: 0,
        realSuccessRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchUserStats };
};
