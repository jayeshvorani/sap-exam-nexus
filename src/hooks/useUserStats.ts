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

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      console.log('Fetching user stats for user:', user.id);
      setLoading(true);

      // Get all completed exam attempts directly
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

      if (attemptsError) {
        console.error('Error fetching attempts:', attemptsError);
        throw attemptsError;
      }

      console.log('Raw attempts data:', attempts);
      console.log('Number of completed attempts found:', attempts?.length || 0);

      const completedAttempts = attempts || [];

      // Separate practice and real exams
      const practiceAttempts = completedAttempts.filter(attempt => attempt.is_practice_mode === true);
      const realAttempts = completedAttempts.filter(attempt => attempt.is_practice_mode === false);

      console.log('Practice attempts:', practiceAttempts.length);
      console.log('Real attempts:', realAttempts.length);

      // Calculate practice stats
      const practiceExamsCompleted = practiceAttempts.length;
      const practiceScores = practiceAttempts.filter(a => a.score !== null).map(a => a.score);
      const practiceAverageScore = practiceScores.length > 0 
        ? Math.round(practiceScores.reduce((sum, score) => sum + score, 0) / practiceScores.length)
        : 0;
      const practicePassedCount = practiceAttempts.filter(a => a.passed === true).length;
      const practiceSuccessRate = practiceExamsCompleted > 0 
        ? Math.round((practicePassedCount / practiceExamsCompleted) * 100)
        : 0;

      // Calculate practice study time
      const practiceStudyTime = practiceAttempts.reduce((total, attempt) => {
        if (attempt.start_time && attempt.end_time) {
          const startTime = new Date(attempt.start_time);
          const endTime = new Date(attempt.end_time);
          const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          return total + hours;
        }
        return total;
      }, 0);

      // Calculate real exam stats
      const realExamsCompleted = realAttempts.length;
      const realScores = realAttempts.filter(a => a.score !== null).map(a => a.score);
      const realAverageScore = realScores.length > 0 
        ? Math.round(realScores.reduce((sum, score) => sum + score, 0) / realScores.length)
        : 0;
      const realPassedCount = realAttempts.filter(a => a.passed === true).length;
      const realSuccessRate = realExamsCompleted > 0 
        ? Math.round((realPassedCount / realExamsCompleted) * 100)
        : 0;

      // Calculate real study time
      const realStudyTime = realAttempts.reduce((total, attempt) => {
        if (attempt.start_time && attempt.end_time) {
          const startTime = new Date(attempt.start_time);
          const endTime = new Date(attempt.end_time);
          const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          return total + hours;
        }
        return total;
      }, 0);

      // Map recent attempts (top 5)
      const recentAttempts = completedAttempts.slice(0, 5).map(attempt => ({
        id: attempt.id,
        exam_title: (attempt.exams as any)?.title || 'Unknown Exam',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completed_at: attempt.end_time || attempt.created_at
      }));

      // Calculate overall stats
      const totalExamsCompleted = practiceExamsCompleted + realExamsCompleted;
      const totalStudyTime = practiceStudyTime + realStudyTime;
      const allScores = [...practiceScores, ...realScores];
      const overallAverageScore = allScores.length > 0 
        ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
        : 0;

      const newStats = {
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

      console.log('Calculated stats:', newStats);

      // Set comprehensive stats
      setStats(newStats);

    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Keep existing stats on error, don't reset to zero
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchUserStats };
};
