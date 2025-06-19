
import { Button } from "@/components/ui/button";
import { BookOpen, User, Settings, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface DashboardHeaderProps {
  onNavigateToProfile: () => void;
  onNavigateToAdmin: () => void;
  onSignOut: () => void;
  isAdmin: boolean;
}

const DashboardHeader = ({ 
  onNavigateToProfile, 
  onNavigateToAdmin, 
  onSignOut, 
  isAdmin 
}: DashboardHeaderProps) => {
  return (
    <header className="header-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-subtitle gradient-text">Prep Vault</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={onNavigateToProfile} 
              className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
            >
              <User className="w-4 h-4 mr-2 text-primary" />
              Profile
            </Button>
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={onNavigateToAdmin} 
                className="border-success/20 hover:border-success/40 hover:bg-success/5 hover:text-success transition-all"
              >
                <Settings className="w-4 h-4 mr-2 text-success" />
                Admin
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onSignOut} 
              className="border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive transition-all"
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

export default DashboardHeader;
