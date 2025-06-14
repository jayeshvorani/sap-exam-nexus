
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QuestionForm from "./QuestionForm";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";

interface Exam {
  id: string;
  title: string;
}

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

interface QuestionFormManagerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingQuestion: Question | null;
  exams: Exam[];
  onSuccess: () => void;
  onCancel: () => void;
}

const QuestionFormManager = ({
  isOpen,
  onOpenChange,
  editingQuestion,
  exams,
  onSuccess,
  onCancel
}: QuestionFormManagerProps) => {
  const { saveQuestion, loading } = useQuestionManagement();

  const [formData, setFormData] = useState({
    question_text: editingQuestion?.question_text || "",
    question_type: editingQuestion?.question_type || "multiple_choice",
    options: editingQuestion?.options ? 
      [...(Array.isArray(editingQuestion.options) ? editingQuestion.options : []), "", "", "", "", ""].slice(0, 5) :
      ["", "", "", "", ""],
    correct_answers: Array.isArray(editingQuestion?.correct_answers) ? editingQuestion.correct_answers : [0],
    difficulty: editingQuestion?.difficulty || "medium",
    explanation: editingQuestion?.explanation || "",
    exam_id: editingQuestion?.exam_id || "",
    image_url: editingQuestion?.image_url || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await saveQuestion(formData, editingQuestion);
    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          <DialogDescription>
            {editingQuestion ? 'Update the question details below' : 'Fill in the details to create a new question'}
          </DialogDescription>
        </DialogHeader>
        
        <QuestionForm
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          exams={exams}
          editingQuestion={editingQuestion}
          onCancel={handleCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuestionFormManager;
