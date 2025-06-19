
import { BookOpen } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <p className="gradient-text font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
