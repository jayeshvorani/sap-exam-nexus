
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Trophy, Clock, Target, TrendingUp } from "lucide-react";

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

const formatStudyTime = (hours: number) => {
  if (hours === 0) return "0m";
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }
  return `${hours}h`;
};

const formatDetailedTime = (practiceTime: number, realTime: number) => {
  const practiceDisplay = formatStudyTime(practiceTime);
  const realDisplay = formatStudyTime(realTime);
  return `${practiceDisplay} practice • ${realDisplay} real`;
};

const StatsCards = ({ stats, statsLoading }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Practice Stats */}
      <Card className="card-professional border-info/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-info" />
              <span className="text-sm font-medium text-muted-foreground">Practice</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              {statsLoading ? "..." : stats.practiceExamsCompleted}
            </div>
            <div className="text-xs text-muted-foreground">
              {statsLoading ? "..." : `${stats.practiceAverageScore}% avg • ${stats.practiceSuccessRate}% pass`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Exams Stats */}
      <Card className="card-professional border-success/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Real Exams</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              {statsLoading ? "..." : stats.realExamsCompleted}
            </div>
            <div className="text-xs text-muted-foreground">
              {statsLoading ? "..." : `${stats.realAverageScore}% avg • ${stats.realSuccessRate}% pass`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Time */}
      <Card className="card-professional border-warning/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Study Time</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              {statsLoading ? "..." : formatStudyTime(stats.totalStudyTime)}
            </div>
            <div className="text-xs text-muted-foreground">
              {statsLoading ? "..." : formatDetailedTime(stats.practiceStudyTime, stats.realStudyTime)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="card-professional border-accent/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Certified</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              {statsLoading ? "..." : stats.certificationsEarned}
            </div>
            <div className="text-xs text-muted-foreground">
              {statsLoading ? "..." : "Real exams passed"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
