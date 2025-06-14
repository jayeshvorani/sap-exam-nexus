import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowLeft, Upload, Plus, Edit, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answers: any;
  difficulty: string;
  explanation?: string;
  exam_id: string;
}

interface Exam {
  id: string;
  title: string;
}

const QuestionManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  console.log('QuestionManagement component rendered');
  console.log('User:', user?.id);
  console.log('IsAdmin:', isAdmin);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form state for adding/editing questions
  const [formData, setFormData] = useState({
    question_text: "",
    question_type: "multiple_choice",
    options: ["", "", "", ""],
    correct_answers: [0],
    difficulty: "medium",
    explanation: "",
    exam_id: ""
  });

  useEffect(() => {
    console.log('useEffect triggered');
    console.log('User check:', !!user);
    console.log('Admin check:', isAdmin);
    
    if (!user || !isAdmin) {
      console.log('Redirecting to dashboard - user or admin check failed');
      navigate("/dashboard");
      return;
    }
    
    console.log('Auth checks passed, fetching data...');
    fetchExams();
    fetchQuestions();
  }, [user, isAdmin, navigate]);

  const fetchExams = async () => {
    try {
      console.log('Fetching exams...');
      const { data, error } = await supabase
        .from('exams')
        .select('id, title')
        .eq('is_active', true)
        .order('title');

      if (error) {
        console.error('Error fetching exams:', error);
        throw error;
      }
      
      console.log('Exams fetched:', data?.length || 0);
      setExams(data || []);
    } catch (error: any) {
      console.error('Error fetching exams:', error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive",
      });
    }
  };

  const fetchQuestions = async () => {
    try {
      console.log('Fetching questions...');
      setLoading(true);
      let query = supabase
        .from('questions')
        .select(`
          *,
          exams!inner(title)
        `)
        .order('created_at', { ascending: false });

      if (selectedExam) {
        query = query.eq('exam_id', selectedExam);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }
      
      console.log('Questions fetched:', data?.length || 0);
      setQuestions(data || []);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simple CSV parsing for demonstration
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    
    // Expected CSV format: question_text,option1,option2,option3,option4,correct_answer,difficulty,explanation,exam_id
    const questions = lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',');
      return {
        question_text: values[0]?.trim() || "",
        options: [values[1]?.trim(), values[2]?.trim(), values[3]?.trim(), values[4]?.trim()].filter(Boolean),
        correct_answers: [parseInt(values[5]?.trim()) || 0],
        difficulty: values[6]?.trim() || "medium",
        explanation: values[7]?.trim() || "",
        exam_id: values[8]?.trim() || selectedExam,
        question_type: "multiple_choice"
      };
    });

    try {
      const { error } = await supabase
        .from('questions')
        .insert(questions);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Imported ${questions.length} questions successfully`,
      });
      
      fetchQuestions();
    } catch (error: any) {
      console.error('Error importing questions:', error);
      toast({
        title: "Error",
        description: "Failed to import questions",
        variant: "destructive",
      });
    }

    // Reset file input
    event.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.exam_id) {
      toast({
        title: "Error",
        description: "Please select an exam",
        variant: "destructive",
      });
      return;
    }

    try {
      const questionData = {
        ...formData,
        options: formData.options.filter(option => option.trim() !== ""),
      };

      let error;
      if (editingQuestion) {
        ({ error } = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', editingQuestion.id));
      } else {
        ({ error } = await supabase
          .from('questions')
          .insert(questionData));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Question ${editingQuestion ? 'updated' : 'added'} successfully`,
      });

      setIsAddDialogOpen(false);
      setEditingQuestion(null);
      resetForm();
      fetchQuestions();
    } catch (error: any) {
      console.error('Error saving question:', error);
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      
      fetchQuestions();
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      question_text: "",
      question_type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answers: [0],
      difficulty: "medium",
      explanation: "",
      exam_id: ""
    });
  };

  const startEdit = (question: Question) => {
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type,
      options: Array.isArray(question.options) ? question.options : ["", "", "", ""],
      correct_answers: Array.isArray(question.correct_answers) ? question.correct_answers : [0],
      difficulty: question.difficulty,
      explanation: question.explanation || "",
      exam_id: question.exam_id
    });
    setEditingQuestion(question);
    setIsAddDialogOpen(true);
  };

  const filteredQuestions = questions.filter(question =>
    question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !isAdmin) {
    console.log('Rendering null due to auth check');
    return null;
  }

  console.log('Rendering main component');

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
              <h1 className="text-xl font-semibold text-gray-900">Question Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Manage Questions</h2>
          <p className="text-gray-600">Import, add, edit, and organize exam questions</p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingQuestion(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
                  <DialogDescription>
                    {editingQuestion ? 'Update the question details below' : 'Fill in the details to create a new question'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="exam">Select Exam</Label>
                    <Select value={formData.exam_id} onValueChange={(value) => setFormData({...formData, exam_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {exams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="question_text">Question Text</Label>
                    <Textarea
                      id="question_text"
                      value={formData.question_text}
                      onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                      placeholder="Enter the question..."
                      required
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Answer Options</Label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 mt-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index] = e.target.value;
                            setFormData({...formData, options: newOptions});
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="checkbox"
                          checked={formData.correct_answers.includes(index)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                correct_answers: [...formData.correct_answers, index]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                correct_answers: formData.correct_answers.filter(i => i !== index)
                              });
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-500">Correct</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <Textarea
                      id="explanation"
                      value={formData.explanation}
                      onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                      placeholder="Explain why this is the correct answer..."
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingQuestion ? 'Update Question' : 'Add Question'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" asChild>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Label>
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedExam} onValueChange={(value) => {
              setSelectedExam(value);
              setTimeout(fetchQuestions, 100);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Exams</SelectItem>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
            <CardDescription>
              Manage all questions across your exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading questions...</div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No questions found. Add some questions to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-md">
                        <div className="truncate">{question.question_text}</div>
                      </TableCell>
                      <TableCell>
                        {exams.find(e => e.id === question.exam_id)?.title || 'Unknown'}
                      </TableCell>
                      <TableCell className="capitalize">{question.question_type}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                      </TableCell>
                      <TableCell>
                        {Array.isArray(question.options) ? question.options.length : 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(question)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
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

export default QuestionManagement;
