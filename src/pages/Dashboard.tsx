
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Settings, LogOut, Clock, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import AdminPromotion from "@/components/admin/AdminPromotion";

const Dashboard = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Immediately return null if Supabase is not configured
  if (!isSupabaseConfigured) {
    // Navigate to home page asynchronously but don't wait
    setTimeout(() => navigate("/", { replace: true }), 0);
    return null;
  }

  useEffect(() => {
    // If Supabase is configured but user is not authenticated, redirect to home
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Show loading while checking authentication
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

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  const exams = [
    {
      id: "1",
      title: "SAP Fundamentals", 
      description: "Basic SAP concepts and navigation",
      questions: 45,
      timeMinutes: 60,
      category: "Fundamentals",
      difficulty: "Beginner"
    },
    {
      id: "2", 
      title: "SAP HANA Basics",
      description: "Introduction to SAP HANA database",
      questions: 30,
      timeMinutes: 45,
      category: "Database",
      difficulty: "Intermediate"
    },
    {
      id: "3",
      title: "SAP S/4HANA Finance",
      description: "Financial processes in S/4HANA",
      questions: 60,
      timeMinutes: 90,
      category: "Finance",
      difficulty: "Advanced"
    }
  ];

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
              <span className="text-sm text-gray-600">Welcome, {user.user_metadata?.full_name || user.email}</span>
              {isAdmin && (
                <Button variant="outline" onClick={() => navigate("/admin")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button variant="outline" onClick={handleSignOut}>
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
          <h2 className="text-3xl font-light text-gray-900 mb-2">Your Dashboard</h2>
          <p className="text-gray-600">Select an exam to get started</p>
        </div>

        {/* Show admin promotion if user is not admin */}
        {!isAdmin && (
          <div className="mb-8">
            <AdminPromotion />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Try Demo</h3>
                    <p className="text-sm text-blue-700">Practice with sample questions</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => navigate("/exam/demo")}
                >
                  Start Demo
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-green-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-green-900">Quick Stats</h3>
                    <p className="text-sm text-green-700">Track your progress</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-green-800">0</div>
                  <div className="text-sm text-green-600">Exams Completed</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-orange-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-orange-900">Study Time</h3>
                    <p className="text-sm text-orange-700">Time spent learning</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-orange-800">0h</div>
                  <div className="text-sm text-orange-600">Total Time</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Exams */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Exams</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{exam.title}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    exam.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    exam.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {exam.difficulty}
                  </span>
                </div>
                <CardDescription>{exam.description}</CardDescription>
                <div className="text-sm text-gray-500 mt-2">
                  <span className="inline-block mr-4">📚 {exam.category}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {exam.questions} questions
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {exam.timeMinutes} minutes
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate(`/exam/${exam.id}`)}
                >
                  Start Exam
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
