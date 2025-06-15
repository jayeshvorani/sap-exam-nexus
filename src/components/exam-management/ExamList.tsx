
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { ExamCard } from "./ExamCard";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  passing_percentage: number;
  is_active: boolean;
  category: string | null;
  difficulty: string | null;
  icon_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ExamListProps {
  exams: Exam[];
  loading: boolean;
  onAddExam: () => void;
  onEditExam: (exam: Exam) => void;
  onDeleteExam: (examId: string) => void;
}

export const ExamList = ({ exams, loading, onAddExam, onEditExam, onDeleteExam }: ExamListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading exams...</p>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No exams found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first exam.</p>
          <Button onClick={onAddExam} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {exams.map((exam) => (
        <ExamCard
          key={exam.id}
          exam={exam}
          onEdit={onEditExam}
          onDelete={onDeleteExam}
        />
      ))}
    </div>
  );
};
