
import { useState, useEffect, useCallback } from "react";
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

  // Persist form data to localStorage to survive window focus changes
  const FORM_DATA_KEY = 'questionFormData';
  
  const saveFormDataToStorage = useCallback((data: any) => {
    try {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, []);

  const loadFormDataFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(FORM_DATA_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load form data:', error);
      return null;
    }
  }, []);

  const clearFormDataFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(FORM_DATA_KEY);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    if (isOpen && !editingQuestion && formData.question_text) {
      saveFormDataToStorage(formData);
    }
  }, [formData, isOpen, editingQuestion, saveFormDataToStorage]);


  // Restore form data when dialog opens for new questions
  useEffect(() => {
    if (isOpen && !editingQuestion) {
      const savedData = loadFormDataFromStorage();
      if (savedData && savedData.question_text) {
        console.log('Restoring form data from storage:', savedData);
        setFormData(savedData);
      } else {
        setFormData(getDefaultFormData());
      }
    }
  }, [isOpen, editingQuestion, loadFormDataFromStorage]);

  // Update form data when editing a question and dialog is open
  useEffect(() => {
    if (isOpen && editingQuestion) {
      console.log('Setting form data for editing question:', editingQuestion);
      console.log('Question exam_ids:', editingQuestion.exam_ids);
      
      const editFormData = {
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
      };
      
      setFormData(editFormData);
    }
  }, [isOpen, editingQuestion?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await saveQuestion(formData, editingQuestion);
    if (success) {
      // Clear stored form data after successful save
      clearFormDataFromStorage();
      setFormData(getDefaultFormData());
      onSuccess();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    // Clear stored form data when canceling
    clearFormDataFromStorage();
    setFormData(getDefaultFormData());
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={onOpenChange}
      modal={false}
    >
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
