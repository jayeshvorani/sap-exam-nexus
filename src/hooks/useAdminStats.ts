
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  totalExams: number;
  totalQuestions: number;
  totalAttempts: number;
  recentActivity: Array<{
    id: string;
    user_name: string;
    exam_title: string;
    score: number;
    completed_at: string;
  }>;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalExams: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get total exams
      const { count: examsCount } = await supabase
        .from('exams')
        .select('*', { count: 'exact', head: true });

      // Get total questions
      const { count: questionsCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      // Get total attempts
      const { count: attemptsCount } = await supabase
        .from('exam_attempts')
        .select('*', { count: 'exact', head: true });

      // Get recent activity
      const { data: recentAttempts, error } = await supabase
        .from('exam_attempts')
        .select(`
          *,
          user_profiles (
            full_name
          ),
          exams (
            title
          )
        `)
        .eq('is_completed', true)
        .order('end_time', { ascending: false })
        .limit(10);

      if (error) throw error;

      const recentActivity = (recentAttempts || []).map(attempt => ({
        id: attempt.id,
        user_name: (attempt.user_profiles as any)?.full_name || 'Unknown User',
        exam_title: (attempt.exams as any)?.title || 'Unknown Exam',
        score: attempt.score || 0,
        completed_at: attempt.end_time || attempt.created_at
      }));

      setStats({
        totalUsers: usersCount || 0,
        totalExams: examsCount || 0,
        totalQuestions: questionsCount || 0,
        totalAttempts: attemptsCount || 0,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchAdminStats };
};
