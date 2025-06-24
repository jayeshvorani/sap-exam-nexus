
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ExamDependencies {
  exam_attempts: number;
  user_exam_assignments: number;
  questions: number;
}

export const useExamDependencies = () => {
  const [loading, setLoading] = useState(false);

  const getExamDependencies = async (examId: string): Promise<ExamDependencies> => {
    try {
      setLoading(true);

      // Get count of exam attempts
      const { count: attemptsCount, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('exam_id', examId);

      if (attemptsError) throw attemptsError;

      // Get count of user assignments
      const { count: assignmentsCount, error: assignmentsError } = await supabase
        .from('user_exam_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('exam_id', examId);

      if (assignmentsError) throw assignmentsError;

      // Get count of questions
      const { count: questionsCount, error: questionsError } = await supabase
        .from('question_exams')
        .select('*', { count: 'exact', head: true })
        .eq('exam_id', examId);

      if (questionsError) throw questionsError;

      return {
        exam_attempts: attemptsCount || 0,
        user_exam_assignments: assignmentsCount || 0,
        questions: questionsCount || 0
      };
    } catch (error) {
      console.error('Error fetching exam dependencies:', error);
      return {
        exam_attempts: 0,
        user_exam_assignments: 0,
        questions: 0
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    getExamDependencies,
    loading
  };
};
