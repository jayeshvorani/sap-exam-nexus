
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

  const fetchUserStats = async () => {
    if (!user) {
      console.log('No user found, skipping stats fetch');
      return;
    }

    try {
      console.log('=== DEBUG: Fetching user stats ===');
      setLoading(true);

      // Debug: Check what data exists in exam_attempts for this user
      console.log('Debugging exam attempts for user:', user.id);
      const { data: debugData, error: debugError } = await supabase
        .rpc('debug_exam_attempts', { target_user_id: user.id });
      
      if (debugError) {
        console.error('Debug query error:', debugError);
      } else {
        console.log('Raw exam attempts data for user:', debugData);
        console.log('Number of exam attempts found:', debugData?.length || 0);
        
        // Let's analyze the data
        if (debugData && debugData.length > 0) {
          console.log('Sample exam attempt:', debugData[0]);
          console.log('Completed attempts:', debugData.filter(a => a.is_completed));
          console.log('Practice attempts:', debugData.filter(a => a.is_practice_mode));
          console.log('Real attempts:', debugData.filter(a => !a.is_practice_mode));
        }
      }

      // Try to get stats from the view
      const { data: viewStats, error: viewError } = await supabase
        .from('user_exam_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (viewError && viewError.code !== 'PGRST116') {
        console.error('Error fetching from view:', viewError);
        throw viewError;
      }

      console.log('Stats from view:', viewStats);

      // If no view data, let's manually calculate from the debug data
      let calculatedStats = {
        practice_exams_completed: 0,
        practice_study_time_hours: 0,
        practice_average_score: 0,
        practice_passed_count: 0,
        practice_total_count: 0,
        real_exams_completed: 0,
        real_study_time_hours: 0,
        real_average_score: 0,
        real_passed_count: 0,
        real_total_count: 0,
        certifications_earned: 0
      };

      if (debugData && debugData.length > 0) {
        const completed = debugData.filter(a => a.is_completed);
        const practiceCompleted = completed.filter(a => a.is_practice_mode);
        const realCompleted = completed.filter(a => !a.is_practice_mode);

        calculatedStats = {
          practice_exams_completed: practiceCompleted.length,
          practice_study_time_hours: practiceCompleted.reduce((sum, a) => {
            if (a.start_time && a.end_time) {
              const hours = (new Date(a.end_time).getTime() - new Date(a.start_time).getTime()) / (1000 * 60 * 60);
              return sum + hours;
            }
            return sum;
          }, 0),
          practice_average_score: practiceCompleted.length > 0 
            ? practiceCompleted.reduce((sum, a) => sum + (a.score || 0), 0) / practiceCompleted.length
            : 0,
          practice_passed_count: practiceCompleted.filter(a => a.passed).length,
          practice_total_count: practiceCompleted.length,
          real_exams_completed: realCompleted.length,
          real_study_time_hours: realCompleted.reduce((sum, a) => {
            if (a.start_time && a.end_time) {
              const hours = (new Date(a.end_time).getTime() - new Date(a.start_time).getTime()) / (1000 * 60 * 60);
              return sum + hours;
            }
            return sum;
          }, 0),
          real_average_score: realCompleted.length > 0 
            ? realCompleted.reduce((sum, a) => sum + (a.score || 0), 0) / realCompleted.length
            : 0,
          real_passed_count: realCompleted.filter(a => a.passed).length,
          real_total_count: realCompleted.length,
          certifications_earned: realCompleted.filter(a => a.passed).length
        };

        console.log('Manually calculated stats:', calculatedStats);
      }

      // Use view data if available, otherwise use calculated stats
      const statsData = viewStats || calculatedStats;

      // Get recent attempts separately
      const { data: recentAttempts, error: attemptsError } = await supabase
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
        .eq('is_completed', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (attemptsError) {
        console.error('Error fetching recent attempts:', attemptsError);
        throw attemptsError;
      }

      console.log('Recent attempts:', recentAttempts);

      // Calculate success rates
      const practiceSuccessRate = statsData.practice_total_count > 0 
        ? Math.round((statsData.practice_passed_count / statsData.practice_total_count) * 100)
        : 0;

      const realSuccessRate = statsData.real_total_count > 0 
        ? Math.round((statsData.real_passed_count / statsData.real_total_count) * 100)
        : 0;

      // Format recent attempts
      const formattedRecentAttempts = (recentAttempts || []).map(attempt => ({
        id: attempt.id,
        exam_title: (attempt.exams as any)?.title || 'Unknown Exam',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completed_at: attempt.end_time || attempt.created_at
      }));

      const finalStats = {
        examsCompleted: Number(statsData.practice_exams_completed) + Number(statsData.real_exams_completed),
        totalStudyTime: Math.round((Number(statsData.practice_study_time_hours) + Number(statsData.real_study_time_hours)) * 10) / 10,
        averageScore: statsData.practice_total_count + statsData.real_total_count > 0 
          ? Math.round(((Number(statsData.practice_average_score) * Number(statsData.practice_total_count)) + 
               (Number(statsData.real_average_score) * Number(statsData.real_total_count))) / 
               (Number(statsData.practice_total_count) + Number(statsData.real_total_count)))
          : 0,
        recentAttempts: formattedRecentAttempts,
        practiceExamsCompleted: Number(statsData.practice_exams_completed),
        practiceStudyTime: Math.round(Number(statsData.practice_study_time_hours) * 10) / 10,
        practiceAverageScore: Math.round(Number(statsData.practice_average_score)),
        practiceSuccessRate,
        realExamsCompleted: Number(statsData.real_exams_completed),
        realStudyTime: Math.round(Number(statsData.real_study_time_hours) * 10) / 10,
        realAverageScore: Math.round(Number(statsData.real_average_score)),
        realSuccessRate
      };

      console.log('=== FINAL CALCULATED STATS ===');
      console.log(finalStats);

      setStats(finalStats);

    } catch (error) {
      console.error('Error in fetchUserStats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user]);

  return { stats, loading, refetch: fetchUserStats };
};
