
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExamManagementHeader } from "@/components/exam-management/ExamManagementHeader";
import { ExamForm } from "@/components/exam-management/ExamForm";
import { ExamList } from "@/components/exam-management/ExamList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

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
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedExams, setSelectedExams] = useState<Set<string>>(new Set());

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

  const bulkDeleteExams = async () => {
    if (selectedExams.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedExams.size} exam(s)?`)) return;

    try {
      const examIds = Array.from(selectedExams);
      const { error } = await supabase
        .from('exams')
        .delete()
        .in('id', examIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${examIds.length} exam(s) deleted successfully`,
      });

      setSelectedExams(new Set());
      fetchExams();
    } catch (error: any) {
      console.error('Error bulk deleting exams:', error);
      toast({
        title: "Error",
        description: "Failed to delete exams",
        variant: "destructive",
      });
    }
  };

  const toggleExamSelection = (examId: string) => {
    const newSelection = new Set(selectedExams);
    if (newSelection.has(examId)) {
      newSelection.delete(examId);
    } else {
      newSelection.add(examId);
    }
    setSelectedExams(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedExams.size === exams.length) {
      setSelectedExams(new Set());
    } else {
      setSelectedExams(new Set(exams.map(exam => exam.id)));
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <ExamManagementHeader onAddExam={handleAddExam} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Bulk Actions */}
        {selectedExams.size > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                {selectedExams.size} exam{selectedExams.size !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={bulkDeleteExams}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        <ExamList
          exams={exams}
          loading={loading}
          onAddExam={handleAddExam}
          onEditExam={handleEditExam}
          onDeleteExam={handleDelete}
          selectedExams={selectedExams}
          onToggleSelection={toggleExamSelection}
          onToggleSelectAll={toggleSelectAll}
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
