
import { useAuth } from "@/hooks/useAuth";
import { ApprovalStatusBanner } from "./ApprovalStatusBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, RefreshCw } from "lucide-react";

const AccessDeniedView = () => {
  const { user, emailVerified, approvalStatus, signOut } = useAuth();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-2">SAP Exam Nexus</h1>
          <p className="text-gray-600">Account Access</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-light">Account Status</CardTitle>
            <CardDescription>
              Your account requires verification and approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ApprovalStatusBanner
              emailVerified={emailVerified}
              approvalStatus={approvalStatus}
              userEmail={user?.email}
            />

            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <h3 className="font-medium mb-2">Account Requirements:</h3>
                <ul className="space-y-1">
                  <li className={`flex items-center ${emailVerified ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${emailVerified ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    Email verification
                  </li>
                  <li className={`flex items-center ${approvalStatus === 'approved' ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${approvalStatus === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    Admin approval
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRefresh} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
                <Button variant="outline" onClick={signOut} className="flex-1">
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccessDeniedView;
