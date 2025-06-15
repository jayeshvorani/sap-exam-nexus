
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ExamManagementHeaderProps {
  onAddExam: () => void;
}

export const ExamManagementHeader = ({ onAddExam }: ExamManagementHeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border shadow-elegant sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/admin")} className="text-foreground hover:bg-accent hover:text-accent-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-foreground">Exam Management</h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="outline" onClick={handleSignOut} className="border-border/50 hover:bg-accent/80">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-foreground mb-2">Manage Exams</h2>
          <p className="text-muted-foreground">Create, edit, and configure exams</p>
        </div>

        {/* Add Exam Button */}
        <div className="mb-6">
          <Button onClick={onAddExam} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Exam
          </Button>
        </div>
      </main>
    </>
  );
};
