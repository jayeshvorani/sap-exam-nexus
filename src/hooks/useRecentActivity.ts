
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RecentAttempt {
  id: string;
  exam_title: string;
  score: number;
  passed: boolean;
  completed_at: string;
}

export const useRecentActivity = () => {
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecentActivity = async () => {
    if (!user) {
      console.log('No user found, skipping recent activity fetch');
      return;
    }

    try {
      console.log('Fetching recent activity for user:', user.id);
      setLoading(true);

      const { data: recentAttempts, error } = await supabase
        .from('exam_attempts')
        .select(`
          id,
          score,
          passed,
          end_time,
          created_at,
          exams!inner (
            title
          )
        `)
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent attempts:', error);
        throw error;
      }

      console.log('Recent attempts raw data:', recentAttempts);

      const formattedRecentAttempts = (recentAttempts || []).map(attempt => ({
        id: attempt.id,
        exam_title: (attempt.exams as any)?.title || 'Unknown Exam',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completed_at: attempt.end_time || attempt.created_at
      }));

      console.log('Formatted recent attempts:', formattedRecentAttempts);
      setRecentAttempts(formattedRecentAttempts);

    } catch (error) {
      console.error('Error in fetchRecentActivity:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, [user]);

  return { recentAttempts, loading, refetch: fetchRecentActivity };
};
