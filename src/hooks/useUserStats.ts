
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
  practiceExamsCompleted: number;
  practiceStudyTime: number;
  practiceAverageScore: number;
  practiceSuccessRate: number;
  realExamsCompleted: number;
  realStudyTime: number;
  realAverageScore: number;
  realSuccessRate: number;
  certificationsEarned: number;
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
    realSuccessRate: 0,
    certificationsEarned: 0
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch all statistics from the view
      const { data: viewStats } = await supabase
        .from('user_exam_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch recent attempts - using same logic as view (end_time and score not null)
      const { data: recentAttempts } = await supabase
        .from('exam_attempts')
        .select(`
          id,
          score,
          passed,
          end_time,
          created_at,
          exams!inner (
            title
          )
        `)
        .eq('user_id', user.id)
        .not('end_time', 'is', null)
        .not('score', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);

      const formattedRecentAttempts = (recentAttempts || []).map(attempt => ({
        id: attempt.id,
        exam_title: (attempt.exams as any)?.title || 'Unknown Exam',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completed_at: attempt.end_time || attempt.created_at
      }));

      // Use view data directly - no more calculations in the hook
      const practiceExamsCompleted = viewStats?.practice_exams_completed || 0;
      const practiceStudyTime = viewStats?.practice_study_time_hours || 0;
      const practiceAverageScore = viewStats?.practice_average_score || 0;
      const practicePassedCount = viewStats?.practice_passed_count || 0;
      const practiceSuccessRate = practiceExamsCompleted > 0 ? Math.round((practicePassedCount / practiceExamsCompleted) * 100) : 0;

      const realExamsCompleted = viewStats?.real_exams_completed || 0;
      const realStudyTime = viewStats?.real_study_time_hours || 0;
      const realAverageScore = viewStats?.real_average_score || 0;
      const realPassedCount = viewStats?.real_passed_count || 0;
      const realSuccessRate = realExamsCompleted > 0 ? Math.round((realPassedCount / realExamsCompleted) * 100) : 0;

      // Get all totals directly from the view
      const totalExamsCompleted = viewStats?.total_exams_completed || 0;
      const totalStudyTime = viewStats?.total_study_time_hours || 0;
      const totalAverageScore = viewStats?.total_average_score || 0;
      const certificationsEarned = viewStats?.certifications_earned || 0;

      setStats({
        examsCompleted: Number(totalExamsCompleted),
        totalStudyTime: Math.round(Number(totalStudyTime) * 10) / 10,
        averageScore: Math.round(Number(totalAverageScore)),
        recentAttempts: formattedRecentAttempts,
        practiceExamsCompleted: Number(practiceExamsCompleted),
        practiceStudyTime: Math.round(Number(practiceStudyTime) * 10) / 10,
        practiceAverageScore: Math.round(Number(practiceAverageScore)),
        practiceSuccessRate,
        realExamsCompleted: Number(realExamsCompleted),
        realStudyTime: Math.round(Number(realStudyTime) * 10) / 10,
        realAverageScore: Math.round(Number(realAverageScore)),
        realSuccessRate,
        certificationsEarned: Number(certificationsEarned)
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
        realSuccessRate: 0,
        certificationsEarned: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return { stats, loading, refetch: fetchStats };
};
