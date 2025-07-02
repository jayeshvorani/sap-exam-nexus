
import { useState, useEffect } from "react";
import { useAdminRouteProtection } from "@/hooks/useAdminRouteProtection";
import QuestionManagementHeader from "@/components/question/QuestionManagementHeader";
import QuestionManagementContent from "@/components/question/QuestionManagementContent";
import { useQuestionData } from "@/hooks/useQuestionData";

const QuestionManagement = () => {
  const { isLoading, isAuthorized } = useAdminRouteProtection();
  const { 
    questions, 
    exams, 
    loading, 
    fetchExams, 
    fetchQuestions, 
    handleBulkImport,
    assignQuestionsToExam 
  } = useQuestionData();
  
  const [selectedExam, setSelectedExam] = useState<string>("all");

  useEffect(() => {
    // Only fetch data if authorized
    if (isAuthorized) {
      console.log('Auth checks passed, fetching data...');
      fetchExams();
      fetchQuestions();
    }
  }, [isAuthorized]);

  const handleRefresh = () => {
    fetchQuestions(selectedExam);
  };

  const handleExamChange = (exam: string) => {
    setSelectedExam(exam);
    fetchQuestions(exam);
  };

  // Show loading while determining authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="gradient-text font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render if authorized (the hook handles redirects)
  if (!isAuthorized) {
    return null;
  }

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
