
import { useExamStatistics } from './useExamStatistics';
import { useRecentActivity } from './useRecentActivity';

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
  const { stats: examStats, loading: examStatsLoading, refetch: refetchExamStats } = useExamStatistics();
  const { recentAttempts, loading: recentLoading, refetch: refetchRecent } = useRecentActivity();

  const loading = examStatsLoading || recentLoading;

  const stats: UserStats = {
    examsCompleted: examStats.practiceExamsCompleted + examStats.realExamsCompleted,
    totalStudyTime: Math.round((examStats.practiceStudyTime + examStats.realStudyTime) * 10) / 10,
    averageScore: examStats.practiceExamsCompleted + examStats.realExamsCompleted > 0 
      ? Math.round(((examStats.practiceAverageScore * examStats.practiceExamsCompleted) + 
           (examStats.realAverageScore * examStats.realExamsCompleted)) / 
           (examStats.practiceExamsCompleted + examStats.realExamsCompleted))
      : 0,
    recentAttempts,
    practiceExamsCompleted: examStats.practiceExamsCompleted,
    practiceStudyTime: examStats.practiceStudyTime,
    practiceAverageScore: examStats.practiceAverageScore,
    practiceSuccessRate: examStats.practiceSuccessRate,
    realExamsCompleted: examStats.realExamsCompleted,
    realStudyTime: examStats.realStudyTime,
    realAverageScore: examStats.realAverageScore,
    realSuccessRate: examStats.realSuccessRate
  };

  const refetch = () => {
    refetchExamStats();
    refetchRecent();
  };

  return { stats, loading, refetch };
};
