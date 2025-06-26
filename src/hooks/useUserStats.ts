
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

    console.log('=== DEBUGGING USER STATS ===');
    console.log('Current user ID:', user.id);

    try {
      // First, get exam attempts
      const { data: allAttempts, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (attemptsError) {
        console.error('Error fetching exam attempts:', attemptsError);
        throw attemptsError;
      }

      console.log('Raw exam attempts from database:', allAttempts);
      console.log('Total attempts found:', allAttempts?.length || 0);

      // Then get exam titles for the attempts
      const examIds = allAttempts?.map(attempt => attempt.exam_id) || [];
      const uniqueExamIds = [...new Set(examIds)];
      
      let examTitles: Record<string, string> = {};
      
      if (uniqueExamIds.length > 0) {
        const { data: examsData, error: examsError } = await supabase
          .from('exams')
          .select('id, title')
          .in('id', uniqueExamIds);

        if (examsError) {
          console.error('Error fetching exam titles:', examsError);
        } else {
          examTitles = examsData?.reduce((acc, exam) => {
            acc[exam.id] = exam.title;
            return acc;
          }, {} as Record<string, string>) || {};
        }
      }

      if (allAttempts && allAttempts.length > 0) {
        console.log('Sample attempt data:');
        console.log('First attempt:', allAttempts[0]);
        
        // Log completion status breakdown
        const completedCount = allAttempts.filter(a => a.is_completed === true).length;
        const incompleteCount = allAttempts.filter(a => a.is_completed === false).length;
        const nullCompletionCount = allAttempts.filter(a => a.is_completed === null).length;
        
        console.log('Completion status breakdown:');
        console.log('- Completed (is_completed = true):', completedCount);
        console.log('- Incomplete (is_completed = false):', incompleteCount);
        console.log('- Null completion status:', nullCompletionCount);
        
        // Log practice vs real breakdown
        const practiceCount = allAttempts.filter(a => a.is_practice_mode === true).length;
        const realCount = allAttempts.filter(a => a.is_practice_mode === false).length;
        const nullModeCount = allAttempts.filter(a => a.is_practice_mode === null).length;
        
        console.log('Mode breakdown:');
        console.log('- Practice mode (is_practice_mode = true):', practiceCount);
        console.log('- Real mode (is_practice_mode = false):', realCount);
        console.log('- Null mode:', nullModeCount);
      }

      // Filter for completed attempts only
      const completedAttempts = (allAttempts || []).filter(attempt => {
        const isCompleted = attempt.is_completed === true;
        console.log(`Attempt ${attempt.id}: is_completed = ${attempt.is_completed}, included = ${isCompleted}`);
        return isCompleted;
      });
      
      console.log('Filtered completed attempts:', completedAttempts.length);

      // Separate practice and real exams
      const practiceAttempts = completedAttempts.filter(attempt => attempt.is_practice_mode);
      const realAttempts = completedAttempts.filter(attempt => !attempt.is_practice_mode);

      console.log('Practice attempts:', practiceAttempts.length);
      console.log('Real attempts:', realAttempts.length);

      // Calculate basic counts
      const examsCompleted = completedAttempts.length;
      const practiceExamsCompleted = practiceAttempts.length;
      const realExamsCompleted = realAttempts.length;

      console.log('Calculated counts:');
      console.log('- Total exams completed:', examsCompleted);
      console.log('- Practice exams completed:', practiceExamsCompleted);
      console.log('- Real exams completed:', realExamsCompleted);

      // Calculate average scores
      const totalScore = completedAttempts.reduce((sum, attempt) => {
        const score = attempt.score || 0;
        console.log(`Adding score ${score} from attempt ${attempt.id}`);
        return sum + score;
      }, 0);
      const averageScore = examsCompleted > 0 ? Math.round(totalScore / examsCompleted) : 0;

      const practiceScore = practiceAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const practiceAverageScore = practiceExamsCompleted > 0 ? Math.round(practiceScore / practiceExamsCompleted) : 0;

      const realScore = realAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const realAverageScore = realExamsCompleted > 0 ? Math.round(realScore / realExamsCompleted) : 0;

      console.log('Score calculations:');
      console.log('- Total score sum:', totalScore);
      console.log('- Average score:', averageScore);
      console.log('- Practice average:', practiceAverageScore);
      console.log('- Real average:', realAverageScore);

      // Calculate success rates
      const practicePassedCount = practiceAttempts.filter(attempt => attempt.passed).length;
      const practiceSuccessRate = practiceExamsCompleted > 0 ? Math.round((practicePassedCount / practiceExamsCompleted) * 100) : 0;

      const realPassedCount = realAttempts.filter(attempt => attempt.passed).length;
      const realSuccessRate = realExamsCompleted > 0 ? Math.round((realPassedCount / realExamsCompleted) * 100) : 0;

      const totalPassedCount = completedAttempts.filter(attempt => attempt.passed).length;
      const overallSuccessRate = examsCompleted > 0 ? Math.round((totalPassedCount / examsCompleted) * 100) : 0;

      console.log('Success rate calculations:');
      console.log('- Practice passed:', practicePassedCount, 'Rate:', practiceSuccessRate + '%');
      console.log('- Real passed:', realPassedCount, 'Rate:', realSuccessRate + '%');
      console.log('- Overall passed:', totalPassedCount, 'Rate:', overallSuccessRate + '%');

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
        exam_title: examTitles[attempt.exam_id] || 'Unknown Exam',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completed_at: attempt.end_time || attempt.created_at,
        is_practice_mode: attempt.is_practice_mode
      }));

      console.log('Recent attempts for display:', recentAttempts.length);

      const finalStats = {
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
      };

      console.log('=== FINAL STATS BEING SET ===');
      console.log(finalStats);
      console.log('=== END DEBUG ===');

      setStats(finalStats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchUserStats };
};
