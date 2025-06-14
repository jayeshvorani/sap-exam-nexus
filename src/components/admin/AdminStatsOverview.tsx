
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
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Total Users</h4>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {loading ? "..." : stats.totalUsers}
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">Total Exams</h4>
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {loading ? "..." : stats.totalExams}
                </div>
              </div>
              <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Total Questions</h4>
                <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {loading ? "..." : stats.totalQuestions}
                </div>
              </div>
              <BarChart className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Total Attempts</h4>
                <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {loading ? "..." : stats.totalAttempts}
                </div>
              </div>
              <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatsOverview;
