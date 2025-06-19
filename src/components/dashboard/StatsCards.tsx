
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Clock, TrendingUp, Trophy, BookOpen, CheckCircle } from "lucide-react";

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

interface StatsCardsProps {
  stats: UserStats;
  statsLoading: boolean;
}

const StatsCards = ({ stats, statsLoading }: StatsCardsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Practice Exams Card */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Practice Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {statsLoading ? "..." : stats.practiceExamsCompleted}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Completed
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {statsLoading ? "..." : `${stats.practiceStudyTime}h`}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Study Time
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {statsLoading ? "..." : `${stats.practiceAverageScore}%`}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Average Score
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {statsLoading ? "..." : `${stats.practiceSuccessRate}%`}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Success Rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Exams Card */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Real Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {statsLoading ? "..." : stats.realExamsCompleted}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Completed
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {statsLoading ? "..." : `${stats.realStudyTime}h`}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Study Time
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {statsLoading ? "..." : `${stats.realAverageScore}%`}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Average Score
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {statsLoading ? "..." : `${stats.realSuccessRate}%`}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Success Rate
              </p>
            </div>
          </div>
          
          {/* Certifications Badge */}
          <div className="flex justify-center pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
              <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                {statsLoading ? "..." : stats.certificationsEarned} Certifications Earned
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
