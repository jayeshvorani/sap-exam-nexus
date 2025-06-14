
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Exam {
  id: string;
  title: string;
  description: string | null;
  total_questions: number;
  duration_minutes: number;
  passing_percentage: number;
  is_active: boolean;
  is_demo: boolean;
  category: string | null;
  difficulty: string | null;
  icon_url: string | null;
  image_url: string | null;
}

export const useExams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('difficulty', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setExams(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching exams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { exams, loading, error, refetch: fetchExams };
};
