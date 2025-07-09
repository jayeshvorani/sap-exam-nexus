import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

  // Reset form when dialog opens/closes or when editing question changes
  useEffect(() => {
    if (isOpen) {
      if (editingQuestion) {
        // Editing mode - populate form with question data
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
      } else {
        // New question mode - start with blank form
        setFormData(getDefaultFormData());
      }
    }
  }, [isOpen, editingQuestion?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await saveQuestion(formData, editingQuestion);
    if (success) {
      setFormData(getDefaultFormData());
      onSuccess();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setFormData(getDefaultFormData());
    onCancel();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</SheetTitle>
          <SheetDescription>
            {editingQuestion ? 'Update the question details below' : 'Fill in the details to create a new question'}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
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
      </SheetContent>
    </Sheet>
  );
};

export default QuestionFormManager;