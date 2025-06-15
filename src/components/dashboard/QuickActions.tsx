
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => navigate("/browse-exams")}
          >
            <BookOpen className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Browse Available Exams
          </Button>
          
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => navigate("/profile")}
          >
            <User className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
            Update Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
