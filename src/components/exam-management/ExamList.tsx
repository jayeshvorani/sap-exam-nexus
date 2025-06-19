
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Plus } from "lucide-react";
import { ExamCard } from "./ExamCard";

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

interface ExamListProps {
  exams: Exam[];
  loading: boolean;
  onAddExam: () => void;
  onEditExam: (exam: Exam) => void;
  onDeleteExam: (examId: string) => void;
  selectedExams: Set<string>;
  onToggleSelection: (examId: string) => void;
  onToggleSelectAll: () => void;
}

export const ExamList = ({ 
  exams, 
  loading, 
  onAddExam, 
  onEditExam, 
  onDeleteExam,
  selectedExams,
  onToggleSelection,
  onToggleSelectAll
}: ExamListProps) => {
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
    <div className="space-y-4">
      {/* Select All Header */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Checkbox
          checked={selectedExams.size === exams.length && exams.length > 0}
          onCheckedChange={onToggleSelectAll}
        />
        <span className="text-sm font-medium text-muted-foreground">
          Select All ({exams.length} exams)
        </span>
      </div>

      {/* Exam Cards */}
      <div className="grid gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="flex items-start gap-3">
            <Checkbox
              checked={selectedExams.has(exam.id)}
              onCheckedChange={() => onToggleSelection(exam.id)}
              className="mt-6"
            />
            <div className="flex-1">
              <ExamCard
                exam={exam}
                onEdit={onEditExam}
                onDelete={onDeleteExam}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
