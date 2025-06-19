
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminManagementTools = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold gradient-text mb-4">Management Tools</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          className="gradient-card border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => navigate("/admin/users")}
        >
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg mx-auto mb-4 flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg gradient-text">Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Create and manage candidate accounts and roles
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="gradient-card border-success/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => navigate("/admin/exams")}
        >
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-success to-success/70 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-md">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg gradient-text">Manage Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Create, edit, and configure exams
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="gradient-card border-warning/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => navigate("/admin/assignments")}
        >
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-warning to-warning/70 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg gradient-text">Assign Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Assign exams to users and manage assignments
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="gradient-card border-info/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => navigate("/admin/questions")}
        >
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-info to-primary rounded-lg mx-auto mb-4 flex items-center justify-center shadow-md">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg gradient-text">Import Questions</CardTitle>
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
