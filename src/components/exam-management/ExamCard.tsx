
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Clock, FileText, CheckCircle } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  passing_percentage: number;
  is_active: boolean;
  is_demo: boolean;
  category: string | null;
  difficulty: string | null;
  icon_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ExamCardProps {
  exam: Exam;
  onEdit: (exam: Exam) => void;
  onDelete: (examId: string) => void;
}

export const ExamCard = ({ exam, onEdit, onDelete }: ExamCardProps) => {
  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-border bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            {exam.icon_url && (
              <img 
                src={exam.icon_url} 
                alt={exam.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <span>{exam.title}</span>
                {exam.is_demo && (
                  <span className="text-xs bg-info/10 text-info px-2 py-1 rounded-full border border-info/20">
                    Demo
                  </span>
                )}
                {!exam.is_active && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full border border-border">
                    Inactive
                  </span>
                )}
                {exam.difficulty && (
                  <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(exam.difficulty)}`}>
                    {exam.difficulty}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="mt-1 text-muted-foreground">
                {exam.category && (
                  <span className="text-sm text-primary font-medium mr-2">
                    {exam.category}
                  </span>
                )}
                {exam.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(exam)}
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(exam.id)}
              className="border-border text-foreground hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{exam.duration_minutes} min</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{exam.total_questions} questions</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <CheckCircle className="w-4 h-4" />
            <span>{exam.passing_percentage}% required</span>
          </div>
          <div className="text-muted-foreground">
            Score: {exam.passing_score}+
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
