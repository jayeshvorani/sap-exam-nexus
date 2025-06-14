
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, ArrowLeft, Clock, FileText, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
    total_questions: 50,
    passing_score: 35,
    passing_percentage: 70,
    is_active: true,
    is_demo: false
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      resetForm();
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration_minutes: 60,
      total_questions: 50,
      passing_score: 35,
      passing_percentage: 70,
      is_active: true,
      is_demo: false
    });
  };

  const startEdit = (exam: Exam) => {
    setFormData({
      title: exam.title,
      description: exam.description || "",
      duration_minutes: exam.duration_minutes,
      total_questions: exam.total_questions,
      passing_score: exam.passing_score,
      passing_percentage: exam.passing_percentage,
      is_active: exam.is_active,
      is_demo: exam.is_demo
    });
    setEditingExam(exam);
    setIsAddDialogOpen(true);
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/admin")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900">Exam Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Manage Exams</h2>
          <p className="text-gray-600">Create, edit, and configure exams</p>
        </div>

        {/* Add Exam Button */}
        <div className="mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingExam(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingExam ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
                <DialogDescription>
                  {editingExam ? 'Update the exam details below.' : 'Fill in the details to create a new exam.'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Exam Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value) || 60})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="total_questions">Total Questions *</Label>
                    <Input
                      id="total_questions"
                      type="number"
                      min="1"
                      value={formData.total_questions}
                      onChange={(e) => setFormData({...formData, total_questions: parseInt(e.target.value) || 50})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="passing_score">Passing Score *</Label>
                    <Input
                      id="passing_score"
                      type="number"
                      min="1"
                      value={formData.passing_score}
                      onChange={(e) => setFormData({...formData, passing_score: parseInt(e.target.value) || 35})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="passing_percentage">Passing Percentage (%) *</Label>
                    <Input
                      id="passing_percentage"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.passing_percentage}
                      onChange={(e) => setFormData({...formData, passing_percentage: parseInt(e.target.value) || 70})}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_demo"
                      checked={formData.is_demo}
                      onCheckedChange={(checked) => setFormData({...formData, is_demo: checked})}
                    />
                    <Label htmlFor="is_demo">Demo Exam</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingExam(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingExam ? 'Update Exam' : 'Create Exam'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Exams List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading exams...</p>
          </div>
        ) : exams.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first exam.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{exam.title}</span>
                        {exam.is_demo && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Demo
                          </span>
                        )}
                        {!exam.is_active && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                            Inactive
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {exam.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(exam)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(exam.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{exam.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{exam.total_questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-gray-500" />
                      <span>{exam.passing_percentage}% required</span>
                    </div>
                    <div className="text-gray-500">
                      Score: {exam.passing_score}+
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamManagement;
