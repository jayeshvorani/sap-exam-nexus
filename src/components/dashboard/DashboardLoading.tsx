
import { BookOpen } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
