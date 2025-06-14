
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

      // Get recent activity - we need to manually join exam_attempts with user_profiles
      // since there's no direct foreign key relationship
      const { data: recentAttempts, error } = await supabase
        .from('exam_attempts')
        .select(`
          id,
          user_id,
          exam_id,
          score,
          end_time,
          created_at
        `)
        .eq('is_completed', true)
        .order('end_time', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Now fetch user profiles and exams separately for the recent attempts
      const recentActivity = [];
      
      if (recentAttempts && recentAttempts.length > 0) {
        const userIds = [...new Set(recentAttempts.map(attempt => attempt.user_id))];
        const examIds = [...new Set(recentAttempts.map(attempt => attempt.exam_id))];

        // Fetch user profiles
        const { data: userProfiles } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .in('id', userIds);

        // Fetch exams
        const { data: exams } = await supabase
          .from('exams')
          .select('id, title')
          .in('id', examIds);

        // Create lookup maps
        const userLookup = new Map(userProfiles?.map(user => [user.id, user.full_name]) || []);
        const examLookup = new Map(exams?.map(exam => [exam.id, exam.title]) || []);

        // Build the recent activity array
        for (const attempt of recentAttempts) {
          recentActivity.push({
            id: attempt.id,
            user_name: userLookup.get(attempt.user_id) || 'Unknown User',
            exam_title: examLookup.get(attempt.exam_id) || 'Unknown Exam',
            score: attempt.score || 0,
            completed_at: attempt.end_time || attempt.created_at
          });
        }
      }

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
