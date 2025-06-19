
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
    <div className="grid md:grid-cols-2 gap-6">
      {/* Practice Exams Card */}
      <Card className="card-elegant hover-lift border-enhanced">
        <CardHeader className="pb-4">
          <CardTitle className="text-subtitle flex items-center gap-3">
            <div className="w-10 h-10 status-info rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            Practice Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 status-info rounded-lg hover-lift">
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? "..." : stats.practiceExamsCompleted}
              </div>
              <p className="text-caption">
                Completed
              </p>
            </div>
            <div className="text-center p-4 status-info rounded-lg hover-lift">
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? "..." : `${stats.practiceStudyTime}h`}
              </div>
              <p className="text-caption">
                Study Time
              </p>
            </div>
            <div className="text-center p-4 status-info rounded-lg hover-lift">
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? "..." : `${stats.practiceAverageScore}%`}
              </div>
              <p className="text-caption">
                Average Score
              </p>
            </div>
            <div className="text-center p-4 status-info rounded-lg hover-lift">
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? "..." : `${stats.practiceSuccessRate}%`}
              </div>
              <p className="text-caption">
                Success Rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Exams Card */}
      <Card className="card-elegant hover-lift border-enhanced">
        <CardHeader className="pb-4">
          <CardTitle className="text-subtitle flex items-center gap-3">
            <div className="w-10 h-10 status-success rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
            Real Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 status-success rounded-lg hover-lift">
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? "..." : stats.realExamsCompleted}
              </div>
              <p className="text-caption">
                Completed
              </p>
            </div>
            <div className="text-center p-4 status-success rounded-lg hover-lift">
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? "..." : `${stats.realStudyTime}h`}
              </div>
              <p className="text-caption">
                Study Time
              </p>
            </div>
            <div className="text-center p-4 status-success rounded-lg hover-lift">
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? "..." : `${stats.realAverageScore}%`}
              </div>
              <p className="text-caption">
                Average Score
              </p>
            </div>
            <div className="text-center p-4 status-success rounded-lg hover-lift">
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? "..." : `${stats.realSuccessRate}%`}
              </div>
              <p className="text-caption">
                Success Rate
              </p>
            </div>
          </div>
          
          {/* Certifications Badge */}
          <div className="flex justify-center pt-2">
            <div className="flex items-center gap-3 px-6 py-3 status-warning rounded-lg hover-lift">
              <Trophy className="h-5 w-5" />
              <span className="text-body font-semibold">
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
