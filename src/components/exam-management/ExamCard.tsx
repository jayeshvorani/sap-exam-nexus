
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
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
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
              <CardTitle className="flex items-center space-x-2">
                <span>{exam.title}</span>
                {exam.is_demo && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Demo
                  </span>
                )}
                {!exam.is_active && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    Inactive
                  </span>
                )}
                {exam.difficulty && (
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(exam.difficulty)}`}>
                    {exam.difficulty}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {exam.category && (
                  <span className="text-sm text-blue-600 font-medium mr-2">
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
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(exam.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{exam.duration_minutes} min</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span>{exam.total_questions} questions</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-gray-500" />
            <span>{exam.passing_percentage}% required</span>
          </div>
          <div className="text-gray-500">
            Score: {exam.passing_score}+
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
