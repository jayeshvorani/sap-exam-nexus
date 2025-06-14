
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User, Settings, Award, Clock, TrendingUp, LogOut } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";
import AccessDeniedView from "@/components/auth/AccessDeniedView";

const Dashboard = () => {
  const { user, loading, isAdmin, isApproved, emailVerified, signOut } = useAuth();
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useUserStats();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleBrowseExams = () => {
    // For now, show a message that this feature is coming soon
    alert("Exam browsing feature is coming soon! Please check back later.");
  };

  const handleStartPractice = () => {
    // For now, show a message that this feature is coming soon
    alert("Practice mode is coming soon! Please check back later.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show access denied view if user is not verified or approved
  if (!emailVerified || !isApproved) {
    return <AccessDeniedView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">SAP Exam Nexus</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/profile")}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              {isAdmin && (
                <Button variant="outline" onClick={() => navigate("/admin")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button variant="outline" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </h2>
          <p className="text-gray-600">Ready to continue your SAP certification journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exams Completed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats.examsCompleted}
              </div>
              <p className="text-xs text-muted-foreground">
                Total certifications earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `${stats.totalStudyTime}h`}
              </div>
              <p className="text-xs text-muted-foreground">
                Hours spent studying
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `${stats.averageScore}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all exams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Available Exams</CardTitle>
              <CardDescription>
                Choose from our comprehensive SAP certification exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={handleBrowseExams}>
                Browse Exams
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Mode</CardTitle>
              <CardDescription>
                Take practice exams with explanations and unlimited attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={handleStartPractice}>
                Start Practice
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {stats.recentAttempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest exam attempts and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentAttempts.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{attempt.exam_title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {attempt.score}%
                      </div>
                      <div className={`text-sm ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {attempt.passed ? 'Passed' : 'Failed'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
