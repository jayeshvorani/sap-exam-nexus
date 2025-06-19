
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import QuestionManagementHeader from "@/components/question/QuestionManagementHeader";
import QuestionManagementContent from "@/components/question/QuestionManagementContent";
import { useQuestionData } from "@/hooks/useQuestionData";

const QuestionManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { 
    questions, 
    exams, 
    loading, 
    fetchExams, 
    fetchQuestions, 
    handleBulkImport,
    assignQuestionsToExam 
  } = useQuestionData();
  
  console.log('QuestionManagement component rendered');
  console.log('User:', user?.id);
  console.log('IsAdmin:', isAdmin);
  
  const [selectedExam, setSelectedExam] = useState<string>("all");

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

  const handleRefresh = () => {
    fetchQuestions(selectedExam);
  };

  const handleExamChange = (exam: string) => {
    setSelectedExam(exam);
    fetchQuestions(exam);
  };

  if (!user || !isAdmin) {
    console.log('Rendering null due to auth check');
    return null;
  }

  console.log('Rendering main component');
  console.log('Exams available for dropdown:', exams);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <QuestionManagementHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light gradient-text mb-2">Manage Questions</h2>
          <p className="text-muted-foreground">Import, add, edit, and organize exam questions</p>
        </div>

        <QuestionManagementContent
          questions={questions}
          exams={exams}
          loading={loading}
          selectedExam={selectedExam}
          setSelectedExam={handleExamChange}
          onImport={handleBulkImport}
          onRefresh={handleRefresh}
          assignQuestionsToExam={assignQuestionsToExam}
        />
      </main>
    </div>
  );
};

export default QuestionManagement;
