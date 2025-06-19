
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Clock, TrendingUp, Trophy, BookOpen, CheckCircle } from "lucide-react";

interface UserStats {
  examsCompleted: number;
  practiceExamsCompleted: number;
  realExamsCompleted: number;
  totalStudyTime: number;
  averageScore: number;
  practiceAverageScore: number;
  realAverageScore: number;
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
    <div className="grid md:grid-cols-6 gap-6 mb-8">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Practice Exams</CardTitle>
          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {statsLoading ? "..." : stats.practiceExamsCompleted}
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: {statsLoading ? "..." : `${stats.practiceAverageScore}%`}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Real Exams</CardTitle>
          <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {statsLoading ? "..." : stats.realExamsCompleted}
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: {statsLoading ? "..." : `${stats.realAverageScore}%`}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Certifications Earned</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {statsLoading ? "..." : stats.certificationsEarned}
          </div>
          <p className="text-xs text-muted-foreground">
            Real exams passed
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Study Time</CardTitle>
          <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {statsLoading ? "..." : `${stats.totalStudyTime}h`}
          </div>
          <p className="text-xs text-muted-foreground">
            Hours spent studying
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Overall Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {statsLoading ? "..." : `${stats.averageScore}%`}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all exams
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Success Rate</CardTitle>
          <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {statsLoading ? "..." : 
              stats.recentAttempts.length > 0 
                ? `${Math.round((stats.recentAttempts.filter(a => a.passed).length / stats.recentAttempts.length) * 100)}%`
                : "0%"
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Pass rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
