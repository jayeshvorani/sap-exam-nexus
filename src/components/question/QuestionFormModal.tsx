import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  // Prevent any visibility or focus-based closing
  useEffect(() => {
    if (!isOpen) return;

    const handleVisibilityChange = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleFocus = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleBlur = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Prevent visibility change events from affecting dialog
    document.addEventListener('visibilitychange', handleVisibilityChange, true);
    window.addEventListener('focus', handleFocus, true);
    window.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, true);
      window.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('blur', handleBlur, true);
    };
  }, [isOpen]);

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

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
    >
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing on outside click
        onEscapeKeyDown={(e) => e.preventDefault()} // Prevent closing on ESC
        onInteractOutside={(e) => e.preventDefault()} // Prevent closing on any outside interaction
        onFocusOutside={(e) => e.preventDefault()} // Prevent closing on focus outside
      >
        <DialogHeader>
          <DialogTitle>
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {editingQuestion ? 'Update the question details below' : 'Fill in the details to create a new question'}
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
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
      </DialogContent>
    </Dialog>
  );
});

export default QuestionFormModal;