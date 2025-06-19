
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Clock, TrendingUp, Trophy, BookOpen, Target } from "lucide-react";

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
}

interface StatsCardsProps {
  stats: UserStats;
  statsLoading: boolean;
}

const StatsCards = ({ stats, statsLoading }: StatsCardsProps) => {
  const certificationsEarned = stats.recentAttempts.filter(attempt => attempt.passed && !attempt.exam_title.includes('Practice')).length;

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-6 mb-8">
      {/* Practice Exams Section */}
      <Card className="border-border bg-card lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Practice Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {stats.practiceExamsCompleted}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {stats.practiceStudyTime}h
              </div>
              <p className="text-xs text-muted-foreground">Study Time</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {stats.practiceAverageScore}%
              </div>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {stats.practiceSuccessRate}%
              </div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Exams Section */}
      <Card className="border-border bg-card lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            Real Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {stats.realExamsCompleted}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {stats.realStudyTime}h
              </div>
              <p className="text-xs text-muted-foreground">Study Time</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {stats.realAverageScore}%
              </div>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {stats.realSuccessRate}%
              </div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Combined Stats */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Total Exams</CardTitle>
          <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.examsCompleted}
          </div>
          <p className="text-xs text-muted-foreground">
            All completed exams
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Certifications</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {certificationsEarned}
          </div>
          <p className="text-xs text-muted-foreground">
            Earned from real exams
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Total Study Time</CardTitle>
          <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.totalStudyTime}h
          </div>
          <p className="text-xs text-muted-foreground">
            Total hours studied
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
