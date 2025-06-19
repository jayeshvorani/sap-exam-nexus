
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
    <header className="bg-background backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Prep Vault</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button variant="outline" onClick={onNavigateToProfile} className="border-border hover:bg-accent">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={onNavigateToAdmin} className="border-border hover:bg-accent">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            <Button variant="outline" onClick={onSignOut} className="border-border hover:bg-accent">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
