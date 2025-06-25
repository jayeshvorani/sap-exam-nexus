
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
  selectedExams?: string[];
  onSelectionChange?: (examIds: string[]) => void;
  onBulkDelete?: () => void;
}

export const ExamList = ({ 
  exams, 
  loading, 
  onAddExam, 
  onEditExam, 
  onDeleteExam,
  selectedExams = [],
  onSelectionChange,
  onBulkDelete
}: ExamListProps) => {
  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? exams.map(exam => exam.id) : []);
    }
  };

  const handleSelectExam = (examId: string, checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange([...selectedExams, examId]);
      } else {
        onSelectionChange(selectedExams.filter(id => id !== examId));
      }
    }
  };

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

  const isAllSelected = selectedExams.length === exams.length && exams.length > 0;
  const isIndeterminate = selectedExams.length > 0 && selectedExams.length < exams.length;

  return (
    <div className="space-y-4">
      {/* Bulk Selection Controls */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-5 flex justify-center">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              style={{
                // Handle indeterminate state manually since Radix doesn't support it directly
                backgroundColor: isIndeterminate ? 'hsl(var(--primary))' : undefined,
                borderColor: isIndeterminate ? 'hsl(var(--primary))' : undefined,
              }}
            />
          </div>
          <span className="text-sm font-medium">
            {selectedExams.length === 0 
              ? "Select all exams" 
              : `${selectedExams.length} of ${exams.length} exams selected`
            }
          </span>
        </div>

        {selectedExams.length > 0 && onBulkDelete && (
          <Button
            variant="outline"
            onClick={onBulkDelete}
            className="border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300"
          >
            <Trash2 className="w-4 h-4 mr-2 text-destructive" />
            Delete Selected
            <span className="ml-2 bg-destructive/20 text-destructive px-2 py-0.5 rounded-full text-xs font-medium">
              {selectedExams.length}
            </span>
          </Button>
        )}
      </div>

      {/* Exam Cards */}
      <div className="grid gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="flex items-start gap-4">
            {/* Checkbox Column - aligned with header */}
            {onSelectionChange && (
              <div className="w-5 pt-6 flex justify-center">
                <Checkbox
                  checked={selectedExams.includes(exam.id)}
                  onCheckedChange={(checked) => handleSelectExam(exam.id, !!checked)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </div>
            )}
            
            {/* Exam Card */}
            <div className="flex-1">
              <ExamCard
                exam={exam}
                onEdit={onEditExam}
                onDelete={onDeleteExam}
                className={selectedExams.includes(exam.id) ? "ring-2 ring-primary/50" : ""}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
