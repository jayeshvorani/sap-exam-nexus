
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
    <header className="header-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")} 
              className="hover:bg-primary/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 text-primary" />
              Back to Admin
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-subtitle gradient-text">Question Management</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              className="border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2 text-destructive" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default QuestionManagementHeader;
