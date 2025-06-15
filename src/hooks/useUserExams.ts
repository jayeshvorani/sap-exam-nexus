
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AssignedExam {
  id: string;
  title: string;
  description: string | null;
  total_questions: number;
  duration_minutes: number;
  passing_percentage: number;
  category: string | null;
  difficulty: string | null;
  icon_url: string | null;
  image_url: string | null;
  assigned_at: string;
}

export const useUserExams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<AssignedExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserExams();
    }
  }, [user]);

  const fetchUserExams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_exam_assignments')
        .select(`
          assigned_at,
          exams!inner(
            id,
            title,
            description,
            total_questions,
            duration_minutes,
            passing_percentage,
            category,
            difficulty,
            icon_url,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .eq('exams.is_active', true);

      if (error) throw error;

      const transformedExams = data?.map(assignment => ({
        ...assignment.exams,
        assigned_at: assignment.assigned_at
      })) || [];

      setExams(transformedExams);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching user exams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { exams, loading, error, refetch: fetchUserExams };
};
