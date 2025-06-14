
import { Button } from "@/components/ui/button";
import { BookOpen, User, Settings, LogOut } from "lucide-react";

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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">SAP Exam Nexus</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onNavigateToProfile}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={onNavigateToAdmin}>
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            <Button variant="outline" onClick={onSignOut}>
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
