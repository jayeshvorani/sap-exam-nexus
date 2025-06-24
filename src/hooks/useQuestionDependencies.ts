
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QuestionDependencies {
  user_answers: number;
  exam_attempts: number;
  exams: string[];
}

export const useQuestionDependencies = () => {
  const [loading, setLoading] = useState(false);

  const getQuestionDependencies = async (questionId: string): Promise<QuestionDependencies> => {
    try {
      setLoading(true);

      // Get exam names this question belongs to
      const { data: examData, error: examError } = await supabase
        .from('question_exams')
        .select(`
          exam_id,
          exams!inner(title)
        `)
        .eq('question_id', questionId);

      if (examError) throw examError;

      const examTitles = examData?.map(item => item.exams.title) || [];

      // Count exam attempts that might involve this question
      const examIds = examData?.map(item => item.exam_id) || [];
      let attemptsCount = 0;
      let answersCount = 0;
      
      if (examIds.length > 0) {
        const { count, error: attemptsError } = await supabase
          .from('exam_attempts')
          .select('*', { count: 'exact', head: true })
          .in('exam_id', examIds);

        if (attemptsError) throw attemptsError;
        attemptsCount = count || 0;

        // For user answers, we'll count exam attempts that have answers
        // Since answers are stored as JSON in exam_attempts table
        const { count: answersCountResult, error: answersError } = await supabase
          .from('exam_attempts')
          .select('*', { count: 'exact', head: true })
          .in('exam_id', examIds)
          .not('answers', 'is', null);

        if (answersError) throw answersError;
        answersCount = answersCountResult || 0;
      }

      return {
        user_answers: answersCount,
        exam_attempts: attemptsCount,
        exams: examTitles
      };
    } catch (error) {
      console.error('Error fetching question dependencies:', error);
      return {
        user_answers: 0,
        exam_attempts: 0,
        exams: []
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    getQuestionDependencies,
    loading
  };
};
