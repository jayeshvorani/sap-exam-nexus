import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QuestionManagementHeader from "@/components/question/QuestionManagementHeader";
import QuestionActions from "@/components/question/QuestionActions";
import QuestionFilters from "@/components/question/QuestionFilters";
import QuestionTable from "@/components/question/QuestionTable";
import QuestionFormManager from "@/components/question/QuestionFormManager";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answers: any;
  difficulty: string;
  explanation?: string;
  exam_id: string;
  image_url?: string;
}

interface Exam {
  id: string;
  title: string;
}

const QuestionManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deleteQuestion } = useQuestionManagement();
  
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
      
      console.log('Exams fetched successfully:', data);
      console.log('Number of exams:', data?.length || 0);
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

  const handleBulkImport = async (questionsToImport: any[]) => {
    try {
      console.log('Importing questions:', questionsToImport);
      const { error } = await supabase
        .from('questions')
        .insert(questionsToImport);

      if (error) {
        console.error('Error importing questions:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Successfully imported ${questionsToImport.length} questions`,
      });
      
      fetchQuestions();
      return true;
    } catch (error: any) {
      console.error('Error importing questions:', error);
      toast({
        title: "Error",
        description: `Failed to import questions: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDelete = async (questionId: string) => {
    const success = await deleteQuestion(questionId);
    if (success) {
      fetchQuestions();
    }
  };

  const handleSuccess = () => {
    setEditingQuestion(null);
    fetchQuestions();
  };

  const handleCancel = () => {
    setEditingQuestion(null);
  };

  const startEdit = (question: Question) => {
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
  console.log('Exams available for dropdown:', exams);

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
            onAddQuestion={() => setIsAddDialogOpen(true)}
            selectedExamId={selectedExam}
            onImport={handleBulkImport}
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

        <QuestionFormManager
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          editingQuestion={editingQuestion}
          exams={exams}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
};

export default QuestionManagement;
