
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="card-elegant border-primary/20">
      <CardHeader>
        <CardTitle className="text-subtitle gradient-text">Quick Actions</CardTitle>
        <CardDescription className="text-body">
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="justify-start border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
            onClick={() => navigate("/browse-exams")}
          >
            <BookOpen className="w-4 h-4 mr-2 text-primary" />
            Browse Available Exams
          </Button>
          
          <Button
            variant="outline"
            className="justify-start border-info/20 hover:border-info/40 hover:bg-info/5 transition-all"
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
