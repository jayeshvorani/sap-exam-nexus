
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useExamAssignments = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const assignExamToUser = async (examId: string, userId: string) => {
    try {
      setLoading(true);
      
      // Check if assignment already exists
      const { data: existing } = await supabase
        .from('user_exam_assignments')
        .select('id')
        .eq('user_id', userId)
        .eq('exam_id', examId)
        .eq('is_active', true)
        .single();

      if (existing) {
        toast({
          title: "Already Assigned",
          description: "This exam is already assigned to the user.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('user_exam_assignments')
        .insert({
          user_id: userId,
          exam_id: examId,
          assigned_by: user?.id,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Exam Assigned",
        description: "The exam has been successfully assigned.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error assigning exam:', error);
      toast({
        title: "Error",
        description: "Failed to assign exam to user",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeExamAssignment = async (userId: string, examId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_exam_assignments')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('exam_id', examId);

      if (error) throw error;

      toast({
        title: "Assignment Removed",
        description: "The exam assignment has been removed.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error removing exam assignment:', error);
      toast({
        title: "Error",
        description: "Failed to remove exam assignment",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignExamToUser,
    removeExamAssignment,
    loading
  };
};
