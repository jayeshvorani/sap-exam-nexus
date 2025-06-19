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
      console.log('=== Starting fresh stats calculation for user:', user.id);
      setLoading(true);

      // First, let's get ALL exam attempts for this user with exam details
      const { data: allAttempts, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select(`
          id,
          user_id,
          exam_id,
          start_time,
          end_time,
          score,
          passed,
          is_completed,
          is_practice_mode,
          created_at,
          exams!inner (
            title
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (attemptsError) {
        console.error('Error fetching exam attempts:', attemptsError);
        throw attemptsError;
      }

      console.log('=== RAW DATA FROM DATABASE ===');
      console.log('Total attempts found:', allAttempts?.length || 0);
      console.log('All attempts:', allAttempts);

      if (!allAttempts || allAttempts.length === 0) {
        console.log('No exam attempts found for user');
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
        return;
      }

      // Filter for completed attempts only
      const completedAttempts = allAttempts.filter(attempt => attempt.is_completed === true);
      console.log('Completed attempts:', completedAttempts.length);

      // Separate practice and real attempts
      const practiceAttempts = completedAttempts.filter(attempt => attempt.is_practice_mode === true);
      const realAttempts = completedAttempts.filter(attempt => attempt.is_practice_mode === false);

      console.log('=== ATTEMPT BREAKDOWN ===');
      console.log('Practice attempts:', practiceAttempts.length);
      console.log('Real attempts:', realAttempts.length);

      // Helper function to calculate study time for attempts
      const calculateStudyTime = (attempts: any[]) => {
        return attempts.reduce((total, attempt) => {
          if (attempt.start_time && attempt.end_time) {
            const startTime = new Date(attempt.start_time);
            const endTime = new Date(attempt.end_time);
            const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
            return total + Math.max(0, hours); // Ensure non-negative
          }
          return total;
        }, 0);
      };

      // Helper function to calculate average score
      const calculateAverageScore = (attempts: any[]) => {
        const attemptsWithScore = attempts.filter(a => a.score !== null && a.score !== undefined);
        if (attemptsWithScore.length === 0) return 0;
        const totalScore = attemptsWithScore.reduce((sum, a) => sum + a.score, 0);
        return Math.round(totalScore / attemptsWithScore.length);
      };

      // Helper function to calculate success rate
      const calculateSuccessRate = (attempts: any[]) => {
        if (attempts.length === 0) return 0;
        const passedCount = attempts.filter(a => a.passed === true).length;
        return Math.round((passedCount / attempts.length) * 100);
      };

      // Calculate practice stats
      const practiceExamsCompleted = practiceAttempts.length;
      const practiceStudyTime = calculateStudyTime(practiceAttempts);
      const practiceAverageScore = calculateAverageScore(practiceAttempts);
      const practiceSuccessRate = calculateSuccessRate(practiceAttempts);

      // Calculate real exam stats
      const realExamsCompleted = realAttempts.length;
      const realStudyTime = calculateStudyTime(realAttempts);
      const realAverageScore = calculateAverageScore(realAttempts);
      const realSuccessRate = calculateSuccessRate(realAttempts);

      // Calculate overall stats
      const totalExamsCompleted = practiceExamsCompleted + realExamsCompleted;
      const totalStudyTime = practiceStudyTime + realStudyTime;
      const overallAverageScore = calculateAverageScore(completedAttempts);

      // Prepare recent attempts (top 5)
      const recentAttempts = completedAttempts.slice(0, 5).map(attempt => ({
        id: attempt.id,
        exam_title: (attempt.exams as any)?.title || 'Unknown Exam',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completed_at: attempt.end_time || attempt.created_at
      }));

      const calculatedStats = {
        examsCompleted: totalExamsCompleted,
        totalStudyTime: Math.round(totalStudyTime * 10) / 10,
        averageScore: overallAverageScore,
        recentAttempts,
        practiceExamsCompleted,
        practiceStudyTime: Math.round(practiceStudyTime * 10) / 10,
        practiceAverageScore,
        practiceSuccessRate,
        realExamsCompleted,
        realStudyTime: Math.round(realStudyTime * 10) / 10,
        realAverageScore,
        realSuccessRate
      };

      console.log('=== FINAL CALCULATED STATS ===');
      console.log(calculatedStats);

      setStats(calculatedStats);

    } catch (error) {
      console.error('Error in fetchUserStats:', error);
      // Don't reset to zero on error, keep existing stats
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user]);

  return { stats, loading, refetch: fetchUserStats };
};
