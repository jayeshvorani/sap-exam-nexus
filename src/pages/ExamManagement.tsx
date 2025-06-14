
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExamManagementHeader } from "@/components/exam-management/ExamManagementHeader";
import { ExamForm } from "@/components/exam-management/ExamForm";
import { ExamList } from "@/components/exam-management/ExamList";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  passing_percentage: number;
  is_active: boolean;
  is_demo: boolean;
  category: string | null;
  difficulty: string | null;
  icon_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const ExamManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/dashboard");
      return;
    }
    
    fetchExams();
  }, [user, isAdmin, navigate]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error: any) {
      console.error('Error fetching exams:', error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const examData = {
        ...formData,
        created_by: user?.id
      };

      let error;
      if (editingExam) {
        ({ error } = await supabase
          .from('exams')
          .update(examData)
          .eq('id', editingExam.id));
      } else {
        ({ error } = await supabase
          .from('exams')
          .insert(examData));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Exam ${editingExam ? 'updated' : 'created'} successfully`,
      });

      setIsAddDialogOpen(false);
      setEditingExam(null);
      fetchExams();
    } catch (error: any) {
      console.error('Error saving exam:', error);
      toast({
        title: "Error",
        description: "Failed to save exam",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam deleted successfully",
      });
      
      fetchExams();
    } catch (error: any) {
      console.error('Error deleting exam:', error);
      toast({
        title: "Error",
        description: "Failed to delete exam",
        variant: "destructive",
      });
    }
  };

  const handleAddExam = () => {
    setEditingExam(null);
    setIsAddDialogOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setIsAddDialogOpen(true);
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ExamManagementHeader onAddExam={handleAddExam} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ExamList
          exams={exams}
          loading={loading}
          onAddExam={handleAddExam}
          onEditExam={handleEditExam}
          onDeleteExam={handleDelete}
        />
      </div>

      <ExamForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleSubmit}
        editingExam={editingExam}
      />
    </div>
  );
};

export default ExamManagement;
