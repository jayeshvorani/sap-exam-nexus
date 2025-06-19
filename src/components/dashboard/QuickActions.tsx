
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="gradient-card border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="gradient-text">Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="justify-start border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
            onClick={() => navigate("/browse-exams")}
          >
            <BookOpen className="w-4 h-4 mr-2 text-primary" />
            Browse Available Exams
          </Button>
          
          <Button
            variant="outline"
            className="justify-start border-info/30 hover:bg-info/10 hover:border-info/50 transition-all duration-200"
            onClick={() => navigate("/profile")}
          >
            <User className="w-4 h-4 mr-2 text-info" />
            Update Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
