
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const QuestionManagementHeader = () => {
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
    <header className="bg-background backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate("/admin")} className="hover:bg-accent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Question Management</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut} className="border-border hover:bg-accent">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default QuestionManagementHeader;
