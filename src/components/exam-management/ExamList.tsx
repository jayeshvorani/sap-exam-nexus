
import { Plus } from "lucide-react";
import { ExamCard } from "./ExamCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { FileText } from "lucide-react";

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
}

export const ExamList = ({ exams, loading, onAddExam, onEditExam, onDeleteExam }: ExamListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner text="Loading exams..." />
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No exams found"
        description="Get started by creating your first exam."
        actionLabel="Create Exam"
        onAction={onAddExam}
      />
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
