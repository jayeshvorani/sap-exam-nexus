
import { useState } from "react";
import QuestionActions from "./QuestionActions";
import QuestionFilters from "./QuestionFilters";
import QuestionTable from "./QuestionTable";
import QuestionFormManager from "./QuestionFormManager";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answers: any;
  difficulty: string;
  explanation?: string;
  exam_id: string;
  image_url?: string;
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
}

const QuestionManagementContent = ({
  questions,
  exams,
  loading,
  selectedExam,
  setSelectedExam,
  onImport,
  onRefresh
}: QuestionManagementContentProps) => {
  const { deleteQuestion } = useQuestionManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleDelete = async (questionId: string) => {
    const success = await deleteQuestion(questionId);
    if (success) {
      onRefresh();
    }
  };

  const handleSuccess = () => {
    setEditingQuestion(null);
    onRefresh();
  };

  const handleCancel = () => {
    setEditingQuestion(null);
  };

  const startEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsAddDialogOpen(true);
  };

  const filteredQuestions = questions.filter(question =>
    question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <QuestionActions
          onAddQuestion={() => setIsAddDialogOpen(true)}
          selectedExamId={selectedExam}
          onImport={onImport}
          onRefresh={onRefresh}
        />

        <QuestionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedExam={selectedExam}
          setSelectedExam={setSelectedExam}
          exams={exams}
          onExamChange={onRefresh}
        />
      </div>

      <QuestionTable
        questions={filteredQuestions}
        exams={exams}
        loading={loading}
        onEdit={startEdit}
        onDelete={handleDelete}
      />

      <QuestionFormManager
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editingQuestion={editingQuestion}
        exams={exams}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </>
  );
};

export default QuestionManagementContent;
