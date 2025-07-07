
import { useState, useEffect } from "react";
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
  image_url?: string;
  exam_ids?: string[];
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

  // Debug logging
  useEffect(() => {
    console.log('QuestionFormManager - isOpen changed:', isOpen);
  }, [isOpen]);

  // Handle window blur/focus events
  useEffect(() => {
    const handleWindowBlur = () => {
      console.log('Window blur event - dialog should stay open');
    };
    
    const handleWindowFocus = () => {
      console.log('Window focus event - dialog should still be open');
    };

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

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

  // Reset form when dialog opens/closes or when we're not editing
  useEffect(() => {
    if (!isOpen || !editingQuestion) {
      setFormData(getDefaultFormData());
    }
  }, [isOpen, editingQuestion]);

  // Update form data when editing a question and dialog is open
  useEffect(() => {
    if (isOpen && editingQuestion) {
      console.log('Setting form data for editing question:', editingQuestion);
      console.log('Question exam_ids:', editingQuestion.exam_ids);
      
      setFormData({
        question_text: editingQuestion.question_text || "",
        question_type: editingQuestion.question_type || "multiple_choice",
        options: editingQuestion.options ? 
          [...(Array.isArray(editingQuestion.options) ? editingQuestion.options : []), "", "", "", "", ""].slice(0, 5) :
          ["", "", "", "", ""],
        correct_answers: Array.isArray(editingQuestion.correct_answers) ? editingQuestion.correct_answers : [0],
        difficulty: editingQuestion.difficulty || "medium",
        explanation: editingQuestion.explanation || "",
        exam_ids: editingQuestion.exam_ids || [],
        image_url: editingQuestion.image_url || ""
      });
    }
  }, [isOpen, editingQuestion?.id]); // Use editingQuestion?.id to detect when we're editing a different question

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await saveQuestion(formData, editingQuestion);
    if (success) {
      // Reset form data after successful save
      setFormData(getDefaultFormData());
      onSuccess();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    // Reset form data when canceling
    setFormData(getDefaultFormData());
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={onOpenChange}
      modal={true}
    >
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          // Only allow escape key to close if window has focus
          if (!document.hasFocus()) {
            e.preventDefault();
          }
        }}
      >
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
