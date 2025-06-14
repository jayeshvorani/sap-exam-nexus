
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QuestionManagementHeader from "@/components/question/QuestionManagementHeader";
import QuestionActions from "@/components/question/QuestionActions";
import QuestionFilters from "@/components/question/QuestionFilters";
import QuestionTable from "@/components/question/QuestionTable";

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
  const [selectedExam, setSelectedExam] = useState<string>("all");
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

      if (selectedExam && selectedExam !== "all") {
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
      <QuestionManagementHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Manage Questions</h2>
          <p className="text-gray-600">Import, add, edit, and organize exam questions</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <QuestionActions
            isAddDialogOpen={isAddDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
            editingQuestion={editingQuestion}
            setEditingQuestion={setEditingQuestion}
            exams={exams}
            onFileUpload={handleFileUpload}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            resetForm={resetForm}
          />

          <QuestionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedExam={selectedExam}
            setSelectedExam={setSelectedExam}
            exams={exams}
            onExamChange={fetchQuestions}
          />
        </div>

        <QuestionTable
          questions={filteredQuestions}
          exams={exams}
          loading={loading}
          onEdit={startEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default QuestionManagement;
