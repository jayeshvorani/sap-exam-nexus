
import { useState } from "react";

interface QuestionFormData {
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: number[];
  difficulty: string;
  explanation: string;
  exam_id: string;
  image_url?: string;
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

export const useQuestionForm = (editingQuestion?: Question | null) => {
  const [formData, setFormData] = useState<QuestionFormData>({
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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({...formData, options: newOptions});
  };

  const handleCorrectAnswerChange = (index: number, isCorrect: boolean) => {
    let newCorrectAnswers = [...formData.correct_answers];
    
    if (isCorrect) {
      if (!newCorrectAnswers.includes(index)) {
        newCorrectAnswers.push(index);
      }
    } else {
      newCorrectAnswers = newCorrectAnswers.filter(i => i !== index);
    }
    
    setFormData({
      ...formData,
      correct_answers: newCorrectAnswers.sort()
    });
  };

  return {
    formData,
    setFormData,
    handleOptionChange,
    handleCorrectAnswerChange
  };
};
