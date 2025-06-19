
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Trophy } from "lucide-react";

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
    <div className="grid md:grid-cols-2 gap-6 content-spacing">
      {/* Practice Exams Card */}
      <Card className="card-elegant border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-subtitle text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Practice Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg status-info">
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats.practiceExamsCompleted}
              </div>
              <p className="text-caption font-medium">
                Completed
              </p>
            </div>
            <div className="text-center p-3 rounded-lg status-info">
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `${stats.practiceStudyTime}h`}
              </div>
              <p className="text-caption font-medium">
                Study Time
              </p>
            </div>
            <div className="text-center p-3 rounded-lg status-info">
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `${stats.practiceAverageScore}%`}
              </div>
              <p className="text-caption font-medium">
                Average Score
              </p>
            </div>
            <div className="text-center p-3 rounded-lg status-info">
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `${stats.practiceSuccessRate}%`}
              </div>
              <p className="text-caption font-medium">
                Success Rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Exams Card */}
      <Card className="card-elegant border-success/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-subtitle text-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Real Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg status-success">
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats.realExamsCompleted}
              </div>
              <p className="text-caption font-medium">
                Completed
              </p>
            </div>
            <div className="text-center p-3 rounded-lg status-success">
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `${stats.realStudyTime}h`}
              </div>
              <p className="text-caption font-medium">
                Study Time
              </p>
            </div>
            <div className="text-center p-3 rounded-lg status-success">
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `${stats.realAverageScore}%`}
              </div>
              <p className="text-caption font-medium">
                Average Score
              </p>
            </div>
            <div className="text-center p-3 rounded-lg status-success">
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `${stats.realSuccessRate}%`}
              </div>
              <p className="text-caption font-medium">
                Success Rate
              </p>
            </div>
          </div>
          
          {/* Certifications Badge */}
          <div className="flex justify-center pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full status-warning border">
              <Trophy className="h-4 w-4" />
              <span className="text-caption font-medium">
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
