
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, FileText, Upload, ArrowLeft, Activity, BarChart } from "lucide-react";
import { useAdminStats } from "@/hooks/useAdminStats";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { stats, loading } = useAdminStats();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-foreground mb-2">Administration</h2>
          <p className="text-muted-foreground">Manage exams, questions, and candidates</p>
        </div>

        {/* Statistics Overview */}
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

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Exam Activity</CardTitle>
                <CardDescription>Latest completed exam attempts across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{activity.user_name}</div>
                        <div className="text-sm text-muted-foreground">{activity.exam_title}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.completed_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${activity.score >= 70 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {activity.score}%
                        </div>
                        <div className={`text-xs ${activity.score >= 70 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                          {activity.score >= 70 ? 'Passed' : 'Failed'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin Actions */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Management Tools</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/users")}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Create and manage candidate accounts and roles
              </CardDescription>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/exams")}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">Manage Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Create, edit, and configure exams
              </CardDescription>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/assignments")}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Assign Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Assign exams to users and manage assignments
              </CardDescription>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/questions")}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-lg">Import Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Upload questions via CSV or Excel
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
