
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ExamAssignmentManagement } from "@/components/admin/ExamAssignmentManagement";
import { useEffect, useState } from "react";

const ExamAssignmentPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  console.log('=== ExamAssignmentPage Render ===');
  console.log('Loading state:', loading);
  console.log('User exists:', !!user);
  console.log('User ID:', user?.id);
  console.log('User email:', user?.email);
  console.log('Is Admin:', isAdmin);
  console.log('Mounted:', mounted);
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  console.log('=================================');

  useEffect(() => {
    console.log('=== ExamAssignmentPage Mount Effect ===');
    setMounted(true);
    
    return () => {
      console.log('ExamAssignmentPage unmounting');
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!mounted) {
      console.log('Component not mounted yet, skipping auth check');
      return;
    }

    console.log('=== ExamAssignmentPage Auth Check ===');
    console.log('Dependencies - user:', !!user, 'isAdmin:', isAdmin, 'loading:', loading);
    
    // Wait for auth to finish loading
    if (loading) {
      console.log('Still loading auth state, waiting...');
      return;
    }

    // Check authentication
    if (!user) {
      console.log('No user found - redirecting to dashboard');
      navigate("/dashboard", { replace: true });
      return;
    }
    
    if (!isAdmin) {
      console.log('User is not admin - redirecting to dashboard');
      navigate("/dashboard", { replace: true });
      return;
    }
    
    console.log('Auth checks passed - user is authenticated admin');
  }, [user, isAdmin, loading, navigate, mounted]);

  // Show loading while auth is being determined or component is mounting
  if (loading || !mounted) {
    console.log('Rendering loading state - loading:', loading, 'mounted:', mounted);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirecting message for non-authenticated users
  if (!user) {
    console.log('No user - showing redirecting message');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('User is not admin - showing access denied message');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Access denied. Redirecting to dashboard...</p>
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
