
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExamQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: number[];
  difficulty: string;
  explanation?: string;
  image_url?: string;
}

export const useExamQuestions = (examId: string) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (examId) {
      fetchExamQuestions();
    }
  }, [examId]);

  const fetchExamQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('question_exams')
        .select(`
          questions!inner(
            id,
            question_text,
            question_type,
            options,
            correct_answers,
            difficulty,
            explanation,
            image_url
          )
        `)
        .eq('exam_id', examId);

      if (error) throw error;

      const transformedQuestions = data?.map(item => item.questions) || [];
      
      // Shuffle questions for real exam
      const shuffledQuestions = [...transformedQuestions].sort(() => Math.random() - 0.5);
      
      setQuestions(shuffledQuestions);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching exam questions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { questions, loading, error, refetch: fetchExamQuestions };
};
