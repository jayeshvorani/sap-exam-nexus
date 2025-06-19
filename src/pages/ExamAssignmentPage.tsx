
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ExamAssignmentManagement } from "@/components/admin/ExamAssignmentManagement";
import { useEffect } from "react";

const ExamAssignmentPage = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="sap-page-container flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading assignment management...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="sap-page-container">
      {/* Header */}
      <header className="sap-page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/admin")} 
                className="sap-nav-item"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Exam Assignments</h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="outline" onClick={handleSignOut} className="sap-btn-secondary">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="sap-page-content">
        <div className="mb-8">
          <h2 className="sap-page-title">Exam Assignment Management</h2>
          <p className="sap-page-subtitle">Assign exams to users and manage existing assignments across the platform</p>
        </div>

        <ExamAssignmentManagement />
      </main>
    </div>
  );
};

export default ExamAssignmentPage;
