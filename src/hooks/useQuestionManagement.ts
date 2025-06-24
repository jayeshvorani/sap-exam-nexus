import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuestionDependencies } from "@/hooks/useQuestionDependencies";

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

interface QuestionFormData {
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: number[];
  difficulty: string;
  explanation: string;
  exam_ids: string[];
  image_url: string;
}

export const useQuestionManagement = () => {
  const { toast } = useToast();
  const { getQuestionDependencies } = useQuestionDependencies();
  const [loading, setLoading] = useState(false);

  const validateQuestionData = (formData: QuestionFormData) => {
    console.log('Validating question data:', formData);

    if (!formData.exam_ids || formData.exam_ids.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one exam",
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
        image_url: formData.image_url?.trim() || null
      };

      console.log('Prepared question data for database:', questionData);

      let questionId;
      if (editingQuestion) {
        const { error: updateError } = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', editingQuestion.id);
        
        if (updateError) throw updateError;
        questionId = editingQuestion.id;

        // Get current exam associations for this question
        const { data: currentAssociations, error: fetchError } = await supabase
          .from('question_exams')
          .select('exam_id')
          .eq('question_id', editingQuestion.id);

        if (fetchError) throw fetchError;

        const currentExamIds = new Set(currentAssociations?.map(a => a.exam_id) || []);
        const newExamIds = new Set(formData.exam_ids);

        // Find associations to add and remove
        const toAdd = formData.exam_ids.filter(examId => !currentExamIds.has(examId));
        const toRemove = Array.from(currentExamIds).filter(examId => !newExamIds.has(examId));

        // Remove associations that are no longer needed
        if (toRemove.length > 0) {
          const { error: deleteError } = await supabase
            .from('question_exams')
            .delete()
            .eq('question_id', editingQuestion.id)
            .in('exam_id', toRemove);

          if (deleteError) throw deleteError;
        }

        // Add new associations
        if (toAdd.length > 0) {
          const newAssociations = toAdd.map(examId => ({
            question_id: questionId,
            exam_id: examId
          }));

          const { error: insertError } = await supabase
            .from('question_exams')
            .insert(newAssociations);

          if (insertError) throw insertError;
        }
      } else {
        const { data: insertedQuestion, error: insertError } = await supabase
          .from('questions')
          .insert(questionData)
          .select()
          .single();
        
        if (insertError) throw insertError;
        questionId = insertedQuestion.id;

        // Create question-exam associations for new question
        const associations = formData.exam_ids.map(examId => ({
          question_id: questionId,
          exam_id: examId
        }));

        const { error: associationError } = await supabase
          .from('question_exams')
          .insert(associations);

        if (associationError) throw associationError;
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

  const deleteQuestion = async (questionId: string, showWarning = true) => {
    if (showWarning) {
      const deps = await getQuestionDependencies(questionId);
      
      if (deps.user_answers > 0 || deps.exam_attempts > 0) {
        const warningMessage = `This question has ${deps.user_answers} user answers and is part of exams with ${deps.exam_attempts} attempts. Deleting it will remove all related data.`;
        
        if (!confirm(`${warningMessage}\n\nAre you sure you want to continue?`)) {
          return false;
        }
      } else if (!confirm('Are you sure you want to delete this question?')) {
        return false;
      }
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question and all related data deleted successfully",
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

  const bulkDeleteQuestions = async (questionIds: string[]) => {
    // Get dependencies for all selected questions
    const allDeps = await Promise.all(
      questionIds.map(questionId => getQuestionDependencies(questionId))
    );

    const totalAnswers = allDeps.reduce((sum, deps) => sum + deps.user_answers, 0);
    const totalAttempts = allDeps.reduce((sum, deps) => sum + deps.exam_attempts, 0);
    const affectedExams = [...new Set(allDeps.flatMap(deps => deps.exams))];

    let warningMessage = `You are about to delete ${questionIds.length} questions.`;
    
    if (totalAnswers > 0 || totalAttempts > 0) {
      warningMessage += `\n\nThis will also delete:`;
      if (totalAnswers > 0) warningMessage += `\n• ${totalAnswers} user answers`;
      if (totalAttempts > 0) warningMessage += `\n• Data from ${totalAttempts} exam attempts`;
      if (affectedExams.length > 0) warningMessage += `\n• Questions from exams: ${affectedExams.join(', ')}`;
      warningMessage += `\n\nThis action cannot be undone.`;
    }

    if (!confirm(warningMessage)) return false;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('questions')
        .delete()
        .in('id', questionIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully deleted ${questionIds.length} questions and all related data`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting questions:', error);
      toast({
        title: "Error",
        description: `Failed to delete questions: ${error.message}`,
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
    bulkDeleteQuestions,
    loading
  };
};
