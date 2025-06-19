
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
    <header className="bg-background/80 backdrop-blur-md border-b border-primary/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold gradient-text">Prep Vault</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button variant="outline" onClick={onNavigateToProfile} className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all">
              <User className="w-4 h-4 mr-2 text-primary" />
              Profile
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={onNavigateToAdmin} className="border-success/30 hover:bg-success/10 hover:border-success/50 transition-all">
                <Settings className="w-4 h-4 mr-2 text-success" />
                Admin
              </Button>
            )}
            <Button variant="outline" onClick={onSignOut} className="border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-all">
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
