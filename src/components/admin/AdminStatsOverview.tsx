
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, BarChart, Activity } from "lucide-react";

interface AdminStatsOverviewProps {
  stats: {
    totalUsers: number;
    totalExams: number;
    totalQuestions: number;
    totalAttempts: number;
  };
  loading: boolean;
}

const AdminStatsOverview = ({ stats, loading }: AdminStatsOverviewProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-foreground mb-4">Platform Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Total Users</h4>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? "..." : stats.totalUsers}
                </div>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Total Exams</h4>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? "..." : stats.totalExams}
                </div>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Total Questions</h4>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? "..." : stats.totalQuestions}
                </div>
              </div>
              <BarChart className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Total Attempts</h4>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? "..." : stats.totalAttempts}
                </div>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatsOverview;
