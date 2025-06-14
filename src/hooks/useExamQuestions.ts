
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

      const transformedQuestions: ExamQuestion[] = data?.map(item => ({
        id: item.questions.id,
        question_text: item.questions.question_text,
        question_type: item.questions.question_type,
        options: Array.isArray(item.questions.options) ? item.questions.options : [],
        correct_answers: Array.isArray(item.questions.correct_answers) ? item.questions.correct_answers : [],
        difficulty: item.questions.difficulty || 'medium',
        explanation: item.questions.explanation || undefined,
        image_url: item.questions.image_url || undefined
      })) || [];
      
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
