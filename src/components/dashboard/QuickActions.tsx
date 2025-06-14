
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickActionsProps {
  onBrowseExams: () => void;
  onStartPractice: () => void;
}

const QuickActions = ({ onBrowseExams, onStartPractice }: QuickActionsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Available Exams</CardTitle>
          <CardDescription>
            Choose from our comprehensive SAP certification exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={onBrowseExams}>
            Browse Exams
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practice Mode</CardTitle>
          <CardDescription>
            Take practice exams with explanations and unlimited attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={onStartPractice}>
            Start Practice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
