
import { useState, useEffect, useCallback } from "react";
import QuestionActions from "./QuestionActions";
import QuestionFilters from "./QuestionFilters";
import QuestionTable from "./QuestionTable";
import QuestionFormManager from "./QuestionFormManager";
import BulkAssignmentDialog from "./BulkAssignmentDialog";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answers: any;
  difficulty: string;
  explanation?: string;
  image_url?: string;
  exams?: { title: string }[];
  exam_ids?: string[];
}

interface Exam {
  id: string;
  title: string;
}

interface QuestionManagementContentProps {
  questions: Question[];
  exams: Exam[];
  loading: boolean;
  selectedExam: string;
  setSelectedExam: (exam: string) => void;
  onImport: (questions: any[]) => Promise<boolean>;
  onRefresh: () => void;
  assignQuestionsToExam: (questionIds: string[], examId: string) => Promise<boolean>;
}

const QuestionManagementContent = ({
  questions,
  exams,
  loading,
  selectedExam,
  setSelectedExam,
  onImport,
  onRefresh,
  assignQuestionsToExam
}: QuestionManagementContentProps) => {
  const { deleteQuestion, bulkDeleteQuestions } = useQuestionManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false);

  // Preserve selected questions when filtering if they're still visible
  const filteredQuestions = questions.filter(question =>
    question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const visibleQuestionIds = new Set(filteredQuestions.map(q => q.id));
    setSelectedQuestions(prev => prev.filter(id => visibleQuestionIds.has(id)));
  }, [selectedExam, searchTerm, questions]);

  const handleDelete = async (questionId: string) => {
    const success = await deleteQuestion(questionId);
    if (success) {
      // Remove from selection if it was selected
      setSelectedQuestions(prev => prev.filter(id => id !== questionId));
      // Don't call onRefresh here to avoid resetting the filter
      // Instead, we'll let the parent component handle this
      onRefresh();
    }
  };

  const handleBulkDelete = async () => {
    const success = await bulkDeleteQuestions(selectedQuestions);
    if (success) {
      setSelectedQuestions([]);
      onRefresh();
    }
  };

  const handleSuccess = useCallback(() => {
    setEditingQuestion(null);
    onRefresh();
  }, [onRefresh]);

  const handleCancel = useCallback(() => {
    setEditingQuestion(null);
  }, []);

  const startEdit = useCallback((question: Question) => {
    setEditingQuestion(question);
    setIsAddDialogOpen(true);
  }, []);

  const handleExamChange = useCallback((examId: string) => {
    setSelectedExam(examId);
    setSelectedQuestions([]); // Clear selection when changing exam filter
  }, [setSelectedExam]);

  const handleBulkAssign = async (questionIds: string[], examId: string) => {
    const success = await assignQuestionsToExam(questionIds, examId);
    if (success) {
      setSelectedQuestions([]);
      onRefresh();
    }
    return success;
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        {/* Grid layout to maintain stable positioning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Actions Column */}
          <div className="min-h-[60px] flex items-start">
            <QuestionActions
              onAddQuestion={() => setIsAddDialogOpen(true)}
              selectedExamId={selectedExam}
              onImport={onImport}
              onRefresh={onRefresh}
              selectedQuestions={selectedQuestions}
              onBulkAssign={() => setIsBulkAssignDialogOpen(true)}
              onBulkDelete={handleBulkDelete}
            />
          </div>

          {/* Filters Column */}
          <div className="min-h-[60px] flex items-start justify-end">
            <QuestionFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedExam={selectedExam}
              setSelectedExam={handleExamChange}
              exams={exams}
              onExamChange={() => {}} // Not needed since we handle it in setSelectedExam
            />
          </div>
        </div>

        {/* Selection Status Bar - Fixed height to prevent layout shifts */}
        <div className="h-8 flex items-center">
          {selectedQuestions.length > 0 && (
            <div className="text-sm text-muted-foreground bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-3 py-2 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <span className="font-medium text-blue-700 dark:text-blue-300">
                {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          )}
        </div>
      </div>

      <QuestionTable
        questions={filteredQuestions}
        exams={exams}
        loading={loading}
        onEdit={startEdit}
        onDelete={handleDelete}
        selectedQuestions={selectedQuestions}
        onSelectionChange={setSelectedQuestions}
      />

      <QuestionFormManager
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editingQuestion={editingQuestion}
        exams={exams}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />

      <BulkAssignmentDialog
        isOpen={isBulkAssignDialogOpen}
        onOpenChange={setIsBulkAssignDialogOpen}
        selectedQuestions={selectedQuestions}
        exams={exams}
        onAssign={handleBulkAssign}
      />
    </>
  );
};

export default QuestionManagementContent;
