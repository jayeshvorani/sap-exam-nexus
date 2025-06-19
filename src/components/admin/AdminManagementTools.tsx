
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminManagementTools = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Management Tools</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/users")}
        >
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Create and manage candidate accounts and roles
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/exams")}
        >
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">Manage Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Create, edit, and configure exams
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/assignments")}
        >
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">Assign Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Assign exams to users and manage assignments
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/questions")}
        >
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">Import Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Upload questions via CSV or Excel
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminManagementTools;
