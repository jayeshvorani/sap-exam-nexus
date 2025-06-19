
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ExamBrowser } from "@/components/exam/ExamBrowser";

const ExamBrowsePage = () => {
  const { user, loading, isApproved, emailVerified } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <p className="text-body text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !emailVerified || !isApproved) {
    navigate("/dashboard");
    return null;
  }

  const handleExamAssigned = () => {
    // Redirect to dashboard to see assigned exams
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="header-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/dashboard")}
                className="hover:bg-primary/5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2 text-primary" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-subtitle gradient-text">Browse Exams</h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto section-padding">
        <div className="content-spacing">
          <h2 className="text-headline gradient-text mb-2">Available Exams</h2>
          <p className="text-body text-muted-foreground">Browse and self-assign exams to get started with your preparation</p>
        </div>

        <ExamBrowser onExamAssigned={handleExamAssigned} />
      </main>
    </div>
  );
};

export default ExamBrowsePage;
