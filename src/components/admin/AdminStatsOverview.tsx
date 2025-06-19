
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
      <h3 className="text-xl font-semibold gradient-text mb-4">Platform Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Total Users</h4>
                <div className="text-2xl font-bold gradient-text">
                  {loading ? "..." : stats.totalUsers}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-success/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Total Exams</h4>
                <div className="text-2xl font-bold gradient-text">
                  {loading ? "..." : stats.totalExams}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-success to-success/70 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-warning/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Total Questions</h4>
                <div className="text-2xl font-bold gradient-text">
                  {loading ? "..." : stats.totalQuestions}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-warning/70 rounded-lg flex items-center justify-center shadow-md">
                <BarChart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-info/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Total Attempts</h4>
                <div className="text-2xl font-bold gradient-text">
                  {loading ? "..." : stats.totalAttempts}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-info to-primary rounded-lg flex items-center justify-center shadow-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatsOverview;
