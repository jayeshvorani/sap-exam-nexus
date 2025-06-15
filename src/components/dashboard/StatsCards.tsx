
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Clock, TrendingUp } from "lucide-react";

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
}

interface StatsCardsProps {
  stats: UserStats;
  statsLoading: boolean;
}

const StatsCards = ({ stats, statsLoading }: StatsCardsProps) => {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Exams Completed</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {statsLoading ? "..." : stats.examsCompleted}
          </div>
          <p className="text-xs text-muted-foreground">
            Total certifications earned
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Study Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
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
          <CardTitle className="text-sm font-medium text-foreground">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
          <Award className="h-4 w-4 text-muted-foreground" />
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
