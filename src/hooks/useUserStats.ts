
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
      // Get ALL exam attempts for the user
      const { data: allAttempts, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select(`
          *,
          exams (
            title
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (attemptsError) throw attemptsError;

      console.log('All exam attempts for user:', allAttempts);

      // Filter for completed attempts only
      const completedAttempts = (allAttempts || []).filter(attempt => attempt.is_completed === true);
      
      console.log('Completed attempts:', completedAttempts);

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

      // Enhanced study time calculation
      const calculateStudyTime = (attempts: any[]) => {
        console.log(`Calculating study time for ${attempts.length} attempts`);
        
        return attempts.reduce((total, attempt) => {
          console.log(`Processing attempt ${attempt.id}:`, {
            start_time: attempt.start_time,
            end_time: attempt.end_time,
            is_completed: attempt.is_completed
          });

          // Only calculate for attempts with both start and end times
          if (!attempt.start_time || !attempt.end_time) {
            console.log(`Missing time data for attempt ${attempt.id}`);
            return total;
          }

          // Parse timestamps more carefully
          let startTime, endTime;
          
          try {
            startTime = new Date(attempt.start_time);
            endTime = new Date(attempt.end_time);
          } catch (error) {
            console.log(`Error parsing dates for attempt ${attempt.id}:`, error);
            return total;
          }

          // Validate parsed dates
          if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            console.log(`Invalid dates for attempt ${attempt.id}:`, {
              startTime: startTime.toString(),
              endTime: endTime.toString()
            });
            return total;
          }

          // Ensure end time is after start time
          if (endTime <= startTime) {
            console.log(`End time not after start time for attempt ${attempt.id}:`, {
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString()
            });
            return total;
          }

          // Calculate duration in hours
          const durationMs = endTime.getTime() - startTime.getTime();
          const durationHours = durationMs / (1000 * 60 * 60);
          
          console.log(`Valid duration for attempt ${attempt.id}: ${durationHours.toFixed(3)} hours`);
          
          return total + durationHours;
        }, 0);
      };

      const practiceStudyTime = calculateStudyTime(practiceAttempts);
      const realStudyTime = calculateStudyTime(realAttempts);
      const totalStudyTime = practiceStudyTime + realStudyTime;
      
      console.log('Final study time calculations:', {
        practiceAttempts: practiceAttempts.length,
        realAttempts: realAttempts.length,
        practiceStudyTime: practiceStudyTime.toFixed(3),
        realStudyTime: realStudyTime.toFixed(3),
        totalStudyTime: totalStudyTime.toFixed(3)
      });

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
        totalStudyTime: Math.round(totalStudyTime * 100) / 100, // Round to 2 decimal places
        practiceStudyTime: Math.round(practiceStudyTime * 100) / 100,
        realStudyTime: Math.round(realStudyTime * 100) / 100,
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
