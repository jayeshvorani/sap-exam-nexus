
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, BookOpen } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  is_active: boolean;
  created_at: string;
}

const ExamManagement = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    duration_minutes: 60,
    total_questions: 30
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
      console.log('Fetching exams from database...');
      
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exams:', error);
        throw error;
      }
      
      console.log('Exams fetched from database:', data);
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

  const handleCreateExam = async () => {
    if (!newExam.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an exam title",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating exam:', newExam);
      
      const examData = {
        title: newExam.title,
        description: newExam.description,
        duration_minutes: newExam.duration_minutes,
        total_questions: newExam.total_questions,
        is_active: true,
        created_by: user?.id
      };

      const { data, error } = await supabase
        .from('exams')
        .insert(examData)
        .select()
        .single();

      if (error) {
        console.error('Error creating exam:', error);
        throw error;
      }

      console.log('Exam created successfully:', data);
      
      toast({
        title: "Success",
        description: "Exam created successfully",
      });

      setNewExam({ title: '', description: '', duration_minutes: 60, total_questions: 30 });
      setIsCreateDialogOpen(false);
      fetchExams(); // Refresh the list
    } catch (error: any) {
      console.error('Error creating exam:', error);
      toast({
        title: "Error",
        description: "Failed to create exam",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam? This will also delete all associated questions.')) {
      return;
    }

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

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'text-green-600 bg-green-100' 
      : 'text-gray-600 bg-gray-100';
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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Exam Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-light text-gray-900 mb-2">Manage Exams</h2>
            <p className="text-gray-600">Create, edit, and configure your exams</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
                <DialogDescription>
                  Set up a new exam with basic configuration
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                    placeholder="Enter exam title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newExam.description}
                    onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                    placeholder="Enter exam description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newExam.duration_minutes}
                      onChange={(e) => setNewExam({ ...newExam, duration_minutes: parseInt(e.target.value) || 60 })}
                      min="1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="questions">Total Questions</Label>
                    <Input
                      id="questions"
                      type="number"
                      value={newExam.total_questions}
                      onChange={(e) => setNewExam({ ...newExam, total_questions: parseInt(e.target.value) || 30 })}
                      min="1"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateExam}>Create Exam</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Exams Table */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Exams</CardTitle>
            <CardDescription>
              Manage your existing exams and their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading exams...</p>
            ) : exams.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No exams found. Create your first exam to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{exam.description}</TableCell>
                      <TableCell>{exam.duration_minutes} min</TableCell>
                      <TableCell>{exam.total_questions}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.is_active)}`}>
                          {exam.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(exam.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteExam(exam.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ExamManagement;
