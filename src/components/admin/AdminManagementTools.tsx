
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminManagementTools = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Management Tools</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/users")}
        >
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-base font-semibold">Manage Users</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-center text-sm">
              Create and manage candidate accounts and roles
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/exams")}
        >
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-base font-semibold">Manage Exams</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-center text-sm">
              Create, edit, and configure exams
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/assignments")}
        >
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-base font-semibold">Assign Exams</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-center text-sm">
              Assign exams to users and manage assignments
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/questions")}
        >
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Upload className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-base font-semibold">Import Questions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-center text-sm">
              Upload questions via CSV or Excel
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminManagementTools;
