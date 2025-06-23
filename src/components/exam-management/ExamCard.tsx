
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Clock, Users, Target, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_percentage: number;
  is_active: boolean;
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
  className?: string;
}

export const ExamCard = ({ exam, onEdit, onDelete, className }: ExamCardProps) => {
  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Card className={cn("border-border bg-card hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {exam.icon_url ? (
                <img src={exam.icon_url} alt="" className="w-6 h-6" />
              ) : (
                <BookOpen className="w-6 h-6 text-primary" />
              )}
              <CardTitle className="text-xl font-semibold gradient-text">{exam.title}</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {exam.description || "No description provided"}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Badge variant={exam.is_active ? "default" : "secondary"}>
              {exam.is_active ? "Active" : "Inactive"}
            </Badge>
            {exam.difficulty && (
              <Badge className={getDifficultyColor(exam.difficulty)}>
                {exam.difficulty}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{exam.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{exam.total_questions} questions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>{exam.passing_percentage}% to pass</span>
          </div>
          {exam.category && (
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline">{exam.category}</Badge>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(exam)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(exam.id)}
            className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
