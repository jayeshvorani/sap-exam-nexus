
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ExamAssignmentManagement } from "@/components/admin/ExamAssignmentManagement";
import { useEffect } from "react";

const ExamAssignmentPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  console.log('ExamAssignmentPage - Auth state:', { 
    loading, 
    hasUser: !!user, 
    userEmail: user?.email,
    isAdmin 
  });

  useEffect(() => {
    console.log('ExamAssignmentPage auth check effect');
    
    // Don't redirect while still loading
    if (loading) {
      console.log('Still loading, waiting...');
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.log('No user found, redirecting to home');
      navigate("/", { replace: true });
      return;
    }
    
    // Check if user is admin
    if (!isAdmin) {
      console.log('User is not admin, redirecting to dashboard');
      navigate("/dashboard", { replace: true });
      return;
    }
    
    console.log('Auth checks passed - rendering assignment page');
  }, [user, isAdmin, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-slate-600 dark:text-slate-400 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-700 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/admin")} 
                className="text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Exam Assignments</h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-slate-900 dark:text-slate-100 mb-2">Exam Assignment Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Assign exams to users and manage existing assignments</p>
        </div>

        <ExamAssignmentManagement />
      </main>
    </div>
  );
};

export default ExamAssignmentPage;
