
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";

interface ServiceUnavailableViewProps {
  onBack: () => void;
}

const ServiceUnavailableView = ({ onBack }: ServiceUnavailableViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">SAP Exam Nexus</h1>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-light">Service Unavailable</CardTitle>
            <CardDescription>
              Authentication service is currently not configured. Please contact support.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onBack} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceUnavailableView;
