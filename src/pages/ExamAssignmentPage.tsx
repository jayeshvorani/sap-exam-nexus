
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ExamAssignmentManagement } from "@/components/admin/ExamAssignmentManagement";
import { useEffect } from "react";

const ExamAssignmentPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  console.log('=== ExamAssignmentPage Debug Info ===');
  console.log('Loading state:', loading);
  console.log('User exists:', !!user);
  console.log('User ID:', user?.id);
  console.log('User email:', user?.email);
  console.log('Is Admin:', isAdmin);
  console.log('Current URL:', window.location.href);
  console.log('=====================================');

  useEffect(() => {
    console.log('=== ExamAssignmentPage useEffect triggered ===');
    console.log('Dependencies - user:', !!user, 'isAdmin:', isAdmin, 'loading:', loading);
    
    // Only redirect if we're sure the user is not authenticated AND not loading
    if (!loading) {
      console.log('Not loading anymore...');
      if (!user) {
        console.log('No user found - redirecting to dashboard');
        navigate("/dashboard");
        return;
      }
      
      if (!isAdmin) {
        console.log('User is not admin - redirecting to dashboard');
        navigate("/dashboard");
        return;
      }
      
      console.log('Auth checks passed - user is authenticated admin');
    } else {
      console.log('Still loading auth state...');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user - showing redirecting message');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('User is not admin - showing redirecting message');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering main ExamAssignmentPage content');

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
