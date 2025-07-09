import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  image_url?: string;
  exam_ids?: string[];
}

interface QuestionFormModalProps {
  exams: Exam[];
  onSuccess: () => void;
}

export interface QuestionFormModalRef {
  openModal: (question?: Question | null) => void;
  closeModal: () => void;
}

const QuestionFormModal = forwardRef<QuestionFormModalRef, QuestionFormModalProps>(({
  exams,
  onSuccess
}, ref) => {
  const { saveQuestion, loading } = useQuestionManagement();
  const [isOpen, setIsOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const getDefaultFormData = () => ({
    question_text: "",
    question_type: "multiple_choice",
    options: ["", "", "", "", ""],
    correct_answers: [0],
    difficulty: "medium",
    explanation: "",
    exam_ids: [],
    image_url: ""
  });

  const [formData, setFormData] = useState(getDefaultFormData());

  useImperativeHandle(ref, () => ({
    openModal: (question = null) => {
      setEditingQuestion(question);
      if (question) {
        setFormData({
          question_text: question.question_text || "",
          question_type: question.question_type || "multiple_choice",
          options: question.options ? 
            [...(Array.isArray(question.options) ? question.options : []), "", "", "", "", ""].slice(0, 5) :
            ["", "", "", "", ""],
          correct_answers: Array.isArray(question.correct_answers) ? question.correct_answers : [0],
          difficulty: question.difficulty || "medium",
          explanation: question.explanation || "",
          exam_ids: question.exam_ids || [],
          image_url: question.image_url || ""
        });
      } else {
        setFormData(getDefaultFormData());
      }
      setIsOpen(true);
    },
    closeModal: () => {
      setIsOpen(false);
      setEditingQuestion(null);
      setFormData(getDefaultFormData());
    }
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await saveQuestion(formData, editingQuestion);
    if (success) {
      setFormData(getDefaultFormData());
      setIsOpen(false);
      setEditingQuestion(null);
      onSuccess();
    }
  };

  const handleCancel = () => {
    setFormData(getDefaultFormData());
    setIsOpen(false);
    setEditingQuestion(null);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Modal */}
      <div className="relative bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {editingQuestion ? 'Update the question details below' : 'Fill in the details to create a new question'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <QuestionForm
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            exams={exams}
            editingQuestion={editingQuestion}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>,
    document.body
  );
});

export default QuestionFormModal;