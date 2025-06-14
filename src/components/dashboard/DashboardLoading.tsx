
import { BookOpen } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
