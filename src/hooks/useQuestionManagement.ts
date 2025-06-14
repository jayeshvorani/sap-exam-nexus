
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface QuestionFormData {
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: number[];
  difficulty: string;
  explanation: string;
  exam_id: string;
  image_url: string;
}

export const useQuestionManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const validateQuestionData = (formData: QuestionFormData) => {
    console.log('Validating question data:', formData);

    if (!formData.exam_id) {
      toast({
        title: "Error",
        description: "Please select an exam",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.question_text.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question text",
        variant: "destructive",
      });
      return false;
    }

    // Filter out empty options
    const validOptions = formData.options.filter(option => option.trim() !== "");
    
    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 answer options",
        variant: "destructive",
      });
      return false;
    }

    // Validate that correct answers are within the range of valid options
    const validCorrectAnswers = formData.correct_answers.filter(index => 
      index < validOptions.length && formData.options[index].trim() !== ""
    );
    
    if (validCorrectAnswers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one correct answer from the provided options",
        variant: "destructive",
      });
      return false;
    }

    return { validOptions, validCorrectAnswers };
  };

  const saveQuestion = async (formData: QuestionFormData, editingQuestion: Question | null) => {
    console.log('Attempting to save question with data:', formData);
    
    const validation = validateQuestionData(formData);
    if (!validation) return false;

    const { validOptions, validCorrectAnswers } = validation;

    try {
      setLoading(true);

      const questionData = {
        question_text: formData.question_text.trim(),
        question_type: formData.question_type,
        options: validOptions,
        correct_answers: validCorrectAnswers,
        difficulty: formData.difficulty,
        explanation: formData.explanation.trim() || null,
        exam_id: formData.exam_id,
        image_url: formData.image_url?.trim() || null
      };

      console.log('Prepared question data for database:', questionData);

      let error;
      if (editingQuestion) {
        const { error: updateError } = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', editingQuestion.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('questions')
          .insert(questionData);
        error = insertError;
      }

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Question ${editingQuestion ? 'updated' : 'added'} successfully`,
      });

      return true;
    } catch (error: any) {
      console.error('Error saving question:', error);
      toast({
        title: "Error",
        description: `Failed to save question: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveQuestion,
    deleteQuestion,
    loading
  };
};
