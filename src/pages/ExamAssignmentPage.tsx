
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ExamAssignmentManagement } from "@/components/admin/ExamAssignmentManagement";
import { useEffect } from "react";

const ExamAssignmentPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  console.log('ExamAssignmentPage - Auth state:', { 
    user: !!user, 
    userId: user?.id,
    isAdmin, 
    loading,
    userObject: user 
  });

  useEffect(() => {
    console.log('ExamAssignmentPage useEffect - Auth check:', {
      hasUser: !!user,
      userId: user?.id,
      isAdmin,
      loading
    });

    if (!loading && (!user || !isAdmin)) {
      console.log('ExamAssignmentPage - Auth failed, redirecting to dashboard');
      console.log('User details:', user);
      console.log('Is admin:', isAdmin);
      navigate("/dashboard");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    console.log('ExamAssignmentPage - Still loading auth state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('ExamAssignmentPage - No user or not admin, should redirect soon');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  console.log('ExamAssignmentPage - Rendering main content for authenticated admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-elegant sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/admin")} className="hover:bg-accent/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-elegant">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gradient">Exam Assignments</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">Exam Assignment Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Assign exams to users and manage existing assignments</p>
        </div>

        <ExamAssignmentManagement />
      </main>
    </div>
  );
};

export default ExamAssignmentPage;
