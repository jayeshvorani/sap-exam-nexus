
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ExamStatistics {
  practiceExamsCompleted: number;
  practiceStudyTime: number;
  practiceAverageScore: number;
  practiceSuccessRate: number;
  realExamsCompleted: number;
  realStudyTime: number;
  realAverageScore: number;
  realSuccessRate: number;
}

export const useExamStatistics = () => {
  const [stats, setStats] = useState<ExamStatistics>({
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

  const fetchStatistics = async () => {
    if (!user) {
      console.log('No user found, skipping stats fetch');
      return;
    }

    try {
      console.log('Fetching exam statistics for user:', user.id);
      setLoading(true);

      // Fetch completed exam attempts directly from the table
      const { data: examAttempts, error } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true);

      if (error) {
        console.error('Error fetching exam attempts:', error);
        throw error;
      }

      console.log('Raw exam attempts data:', examAttempts);

      // Separate practice and real exams
      const practiceAttempts = examAttempts?.filter(attempt => attempt.is_practice_mode) || [];
      const realAttempts = examAttempts?.filter(attempt => !attempt.is_practice_mode) || [];

      console.log('Practice attempts:', practiceAttempts);
      console.log('Real attempts:', realAttempts);

      // Calculate practice stats
      const practiceExamsCompleted = practiceAttempts.length;
      const practiceAverageScore = practiceAttempts.length > 0 
        ? Math.round(practiceAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / practiceAttempts.length)
        : 0;
      const practicePassedCount = practiceAttempts.filter(attempt => attempt.passed).length;
      const practiceSuccessRate = practiceAttempts.length > 0 
        ? Math.round((practicePassedCount / practiceAttempts.length) * 100)
        : 0;

      // Calculate practice study time
      const practiceStudyTime = practiceAttempts.reduce((total, attempt) => {
        if (attempt.start_time && attempt.end_time) {
          const startTime = new Date(attempt.start_time);
          const endTime = new Date(attempt.end_time);
          const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          return total + durationHours;
        }
        return total;
      }, 0);

      // Calculate real exam stats
      const realExamsCompleted = realAttempts.length;
      const realAverageScore = realAttempts.length > 0 
        ? Math.round(realAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / realAttempts.length)
        : 0;
      const realPassedCount = realAttempts.filter(attempt => attempt.passed).length;
      const realSuccessRate = realAttempts.length > 0 
        ? Math.round((realPassedCount / realAttempts.length) * 100)
        : 0;

      // Calculate real study time
      const realStudyTime = realAttempts.reduce((total, attempt) => {
        if (attempt.start_time && attempt.end_time) {
          const startTime = new Date(attempt.start_time);
          const endTime = new Date(attempt.end_time);
          const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          return total + durationHours;
        }
        return total;
      }, 0);

      const calculatedStats = {
        practiceExamsCompleted,
        practiceStudyTime: Math.round(practiceStudyTime * 10) / 10,
        practiceAverageScore,
        practiceSuccessRate,
        realExamsCompleted,
        realStudyTime: Math.round(realStudyTime * 10) / 10,
        realAverageScore,
        realSuccessRate
      };

      console.log('Calculated statistics:', calculatedStats);
      setStats(calculatedStats);

    } catch (error) {
      console.error('Error in fetchStatistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [user]);

  return { stats, loading, refetch: fetchStatistics };
};
