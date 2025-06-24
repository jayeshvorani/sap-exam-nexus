import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExamManagementHeader } from "@/components/exam-management/ExamManagementHeader";
import { ExamForm } from "@/components/exam-management/ExamForm";
import { ExamList } from "@/components/exam-management/ExamList";
import { DependencyWarningDialog } from "@/components/common/DependencyWarningDialog";
import { useExamDependencies } from "@/hooks/useExamDependencies";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_percentage: number;
  is_active: boolean;
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
  const { getExamDependencies, loading: dependenciesLoading } = useExamDependencies();
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<{ id: string; title: string } | null>(null);
  const [dependencies, setDependencies] = useState<any[]>([]);

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

  const handleDeleteClick = async (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;
    
    setExamToDelete({ id: examId, title: exam.title });
    
    // Get dependencies for this exam
    const deps = await getExamDependencies(examId);
    
    setDependencies([
      { type: "exam attempts", count: deps.exam_attempts },
      { type: "user assignments", count: deps.user_exam_assignments },
      { type: "questions", count: deps.questions }
    ]);
    
    setDeleteWarningOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!examToDelete) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam and all related data deleted successfully",
      });
      
      setSelectedExams(prev => prev.filter(id => id !== examToDelete.id));
      fetchExams();
    } catch (error: any) {
      console.error('Error deleting exam:', error);
      toast({
        title: "Error",
        description: "Failed to delete exam",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteWarningOpen(false);
      setExamToDelete(null);
    }
  };

  const handleBulkDeleteClick = async () => {
    if (selectedExams.length === 0) return;

    // Get dependencies for all selected exams
    const allDeps = await Promise.all(
      selectedExams.map(examId => getExamDependencies(examId))
    );

    const totalDeps = allDeps.reduce(
      (acc, deps) => ({
        exam_attempts: acc.exam_attempts + deps.exam_attempts,
        user_exam_assignments: acc.user_exam_assignments + deps.user_exam_assignments,
        questions: acc.questions + deps.questions
      }),
      { exam_attempts: 0, user_exam_assignments: 0, questions: 0 }
    );

    setDependencies([
      { type: "exam attempts", count: totalDeps.exam_attempts },
      { type: "user assignments", count: totalDeps.user_exam_assignments },
      { type: "questions", count: totalDeps.questions }
    ]);

    setExamToDelete({ id: 'bulk', title: `${selectedExams.length} exams` });
    setDeleteWarningOpen(true);
  };

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('exams')
        .delete()
        .in('id', selectedExams);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully deleted ${selectedExams.length} exams and all related data`,
      });
      
      setSelectedExams([]);
      fetchExams();
    } catch (error: any) {
      console.error('Error deleting exams:', error);
      toast({
        title: "Error",
        description: `Failed to delete exams: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteWarningOpen(false);
      setExamToDelete(null);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <ExamManagementHeader onAddExam={handleAddExam} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light gradient-text mb-2">Exam Management</h2>
          <p className="text-muted-foreground">Create, edit, and manage exam configurations</p>
        </div>
        
        <ExamList
          exams={exams}
          loading={loading}
          onAddExam={handleAddExam}
          onEditExam={handleEditExam}
          onDeleteExam={handleDeleteClick}
          selectedExams={selectedExams}
          onSelectionChange={setSelectedExams}
          onBulkDelete={handleBulkDeleteClick}
        />
      </div>

      <ExamForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleSubmit}
        editingExam={editingExam}
      />

      <DependencyWarningDialog
        isOpen={deleteWarningOpen}
        onClose={() => setDeleteWarningOpen(false)}
        onConfirm={examToDelete?.id === 'bulk' ? handleBulkDelete : handleConfirmDelete}
        title="Delete Exam"
        itemName={examToDelete?.title || ''}
        dependencies={dependencies}
        loading={loading || dependenciesLoading}
      />
    </div>
  );
};

export default ExamManagement;
