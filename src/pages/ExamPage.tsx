
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import ExamQuestion from "@/components/exam/ExamQuestion";
import ExamNavigation from "@/components/exam/ExamNavigation";
import ExamTimer from "@/components/exam/ExamTimer";
import ExamResults from "@/components/exam/ExamResults";
import ExamNavigationControls from "@/components/exam/ExamNavigationControls";
import ExamLoading from "@/components/exam/ExamLoading";
import ExamError from "@/components/exam/ExamError";
import ExamStartScreen from "@/components/exam/ExamStartScreen";
import { useExamQuestions } from "@/hooks/useExamQuestions";
import { useExamState } from "@/hooks/useExamState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { processQuestions, calculateExamResults } from "@/utils/examUtils";

const ExamPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    state,
    updateState,
    handleAnswerSelect,
    handleToggleFlag,
    resetExam,
    startExam: startExamState,
    finishExam,
    startReview,
    exitReview,
  } = useExamState();

  const mode = searchParams.get('mode') || 'practice';
  const isPracticeMode = mode === 'practice';
  const questionCount = parseInt(searchParams.get('questionCount') || '0');
  const randomizeQuestions = searchParams.get('randomizeQuestions') === 'true';
  const randomizeAnswers = searchParams.get('randomizeAnswers') === 'true';
  
  // Early redirect if no exam ID
  useEffect(() => {
    if (!id) {
      console.log('No exam ID provided, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
  }, [id, navigate]);
  
  const { questions: allQuestions, loading: questionsLoading, error: questionsError } = useExamQuestions(id || '');
  
  const [examData, setExamData] = useState<any>(null);
  const [examDataLoading, setExamDataLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [processedQuestions, setProcessedQuestions] = useState<any[]>([]);

  // Process questions based on user selections
  useEffect(() => {
    if (allQuestions.length === 0) return;

    const questions = processQuestions(allQuestions, {
      isPracticeMode,
      questionCount: questionCount > 0 ? questionCount : undefined,
      randomizeQuestions,
      randomizeAnswers
    });

    setProcessedQuestions(questions);
  }, [allQuestions, isPracticeMode, questionCount, randomizeQuestions, randomizeAnswers]);

  const questions = processedQuestions;
  const totalQuestions = questions.length;
  const timeLimit = examData?.duration_minutes || 60;
  const passingScore = examData?.passing_percentage || 70;

  const answeredQuestions = new Set(Object.keys(state.answers).map(Number));

  // Return early if no ID
  if (!id) {
    return null;
  }

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        console.log('Fetching exam data for ID:', id);
        setExamDataLoading(true);
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching exam:', error);
          throw error;
        }

        console.log('Exam data fetched:', data);
        setExamData(data);
      } catch (error: any) {
        console.error('Error fetching exam:', error);
        toast({
          title: "Error",
          description: "Failed to load exam data",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setExamDataLoading(false);
      }
    };

    fetchExamData();
  }, [id, navigate, toast]);

  // Check if user has access to this exam
  useEffect(() => {
    const checkExamAccess = async () => {
      if (!user || !examData) {
        console.log('Missing required data for access check:', { user: !!user, examData: !!examData });
        return;
      }

      try {
        console.log('Checking exam access for user:', user.id, 'exam:', id);
        
        const { data, error } = await supabase
          .from('user_exam_assignments')
          .select('id')
          .eq('user_id', user.id)
          .eq('exam_id', id)
          .eq('is_active', true)
          .single();

        console.log('Access check result:', { data, error });

        if (error || !data) {
          console.log('Access denied - no valid assignment found');
          setHasAccess(false);
        } else {
          console.log('Access granted');
          setHasAccess(true);
        }
      } catch (error) {
        console.error('Error checking exam access:', error);
        setHasAccess(false);
      } finally {
        setAccessChecked(true);
      }
    };

    checkExamAccess();
  }, [id, user, examData]);

  const getFilteredQuestions = () => {
    if (!state.showOnlyFlagged) return Array.from({ length: totalQuestions }, (_, i) => i + 1);
    return Array.from(state.flaggedQuestions).sort((a, b) => a - b);
  };

  const filteredQuestions = getFilteredQuestions();

  // Reset to first question when filter changes
  useEffect(() => {
    console.log('Filter changed:', { showOnlyFlagged: state.showOnlyFlagged, filteredQuestions, currentQuestion: state.currentQuestion });
    if (state.showOnlyFlagged && filteredQuestions.length > 0) {
      console.log('Setting current question to first flagged:', filteredQuestions[0]);
      updateState({ currentQuestion: filteredQuestions[0] });
    } else if (!state.showOnlyFlagged) {
      console.log('Setting current question to 1');
      updateState({ currentQuestion: 1 });
    }
  }, [state.showOnlyFlagged, filteredQuestions.length, updateState]);

  const startExam = async () => {
    console.log('Start exam button clicked');
    
    if (!user || !id) {
      console.log('Cannot start exam - missing user or exam ID');
      toast({
        title: "Error",
        description: "Missing user or exam information",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting exam attempt for user:', user.id, 'exam:', id, 'practice mode:', isPracticeMode);
      
      const { data, error } = await supabase
        .from('exam_attempts')
        .insert({
          user_id: user.id,
          exam_id: id,
          is_practice_mode: isPracticeMode,
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating exam attempt:', error);
        throw error;
      }

      console.log('Exam attempt created successfully:', data);
      startExamState();
    } catch (error: any) {
      console.error('Error starting exam:', error);
      toast({
        title: "Error",
        description: "Failed to start exam: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitExam = async () => {
    console.log('handleSubmitExam called');
    
    finishExam();
    
    if (!isPracticeMode) {
      console.log('Real exam mode - saving results');
      try {
        const results = calculateExamResults(questions, state.answers, state.flaggedQuestions, state.startTime, new Date());
        const passed = results.score >= passingScore;

        await supabase
          .from('exam_attempts')
          .update({
            answers: state.answers,
            flagged_questions: Array.from(state.flaggedQuestions),
            score: Math.round(results.score),
            passed: passed,
            is_completed: true,
            end_time: new Date().toISOString()
          })
          .eq('user_id', user?.id)
          .eq('exam_id', id)
          .eq('is_completed', false)
          .order('created_at', { ascending: false })
          .limit(1);

      } catch (error: any) {
        console.error('Error saving exam results:', error);
        toast({
          title: "Warning",
          description: "Exam completed but results may not have been saved properly",
          variant: "destructive",
        });
      }
    }
  };

  const handleTimeUp = () => {
    handleSubmitExam();
  };

  const handleRestart = () => {
    resetExam();
  };

  const handleReview = () => {
    startReview();
  };

  const handleBackToResults = () => {
    exitReview();
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Show loading while fetching exam data
  if (examDataLoading) {
    return <ExamLoading message="Loading exam data..." />;
  }

  if (questionsError) {
    return (
      <ExamError
        title="Error Loading Questions"
        message={`Failed to load exam questions: ${questionsError}`}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  if (accessChecked && !hasAccess) {
    return (
      <ExamError
        title="Access Denied"
        message="You don't have access to this exam."
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  if (questionsLoading || !accessChecked) {
    return (
      <ExamLoading
        message={
          questionsLoading ? "Loading questions..." : "Checking access..."
        }
      />
    );
  }

  if (questions.length === 0) {
    return (
      <ExamError
        title="No Questions Available"
        message="This exam doesn't have any questions yet."
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  if (!state.examStarted) {
    return (
      <ExamStartScreen
        examTitle={examData?.title || 'Exam'}
        isPracticeMode={isPracticeMode}
        totalQuestions={totalQuestions}
        timeLimit={timeLimit}
        passingScore={passingScore}
        randomizeQuestions={randomizeQuestions}
        randomizeAnswers={randomizeAnswers}
        hasAccess={hasAccess}
        accessChecked={accessChecked}
        onStartExam={startExam}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  // Show results when exam is finished and not in review mode
  if (state.examFinished && !state.isReviewMode) {
    const results = calculateExamResults(questions, state.answers, state.flaggedQuestions, state.startTime, state.endTime);
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <ExamResults
          {...results}
          totalQuestions={totalQuestions}
          passingScore={passingScore}
          onRestart={handleRestart}
          onReview={handleReview}
          onBackToDashboard={handleBackToDashboard}
          examTitle={examData?.title || 'Exam'}
          isDemo={isPracticeMode}
        />
      </div>
    );
  }

  const currentQuestionData = questions[state.currentQuestion - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              {examData?.title || 'Exam'} - {isPracticeMode ? 'Practice Mode' : 'Real Exam'}
              {state.isReviewMode && " - Review Mode"}
            </h1>
            {state.showOnlyFlagged && (
              <p className="text-sm text-orange-600">Showing only flagged questions ({filteredQuestions.length} questions)</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {state.examStarted && !state.examFinished && !isPracticeMode && (
              <ExamTimer
                totalTimeMinutes={timeLimit}
                onTimeUp={handleTimeUp}
                isActive={true}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ExamNavigation
              totalQuestions={totalQuestions}
              currentQuestion={state.currentQuestion}
              answeredQuestions={answeredQuestions}
              flaggedQuestions={state.flaggedQuestions}
              onQuestionSelect={(questionNumber) => updateState({ currentQuestion: questionNumber })}
              onSubmitExam={state.isReviewMode ? handleBackToResults : handleSubmitExam}
              isDemo={isPracticeMode}
              showOnlyFlagged={state.showOnlyFlagged}
              onToggleFilter={(show) => updateState({ showOnlyFlagged: show })}
              filteredQuestions={filteredQuestions}
              isReviewMode={state.isReviewMode}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            {currentQuestionData && (
              <ExamQuestion
                question={{
                  id: currentQuestionData.id,
                  text: currentQuestionData.question_text,
                  answers: currentQuestionData.options.map((option: string, index: number) => ({
                    id: index.toString(),
                    text: option,
                    isCorrect: currentQuestionData.correct_answers.includes(index)
                  })),
                  explanation: currentQuestionData.explanation,
                  category: currentQuestionData.difficulty || 'General'
                }}
                selectedAnswer={state.answers[state.currentQuestion] || null}
                onAnswerSelect={(answerId) => handleAnswerSelect(state.currentQuestion, answerId)}
                isFlagged={state.flaggedQuestions.has(state.currentQuestion)}
                onToggleFlag={() => handleToggleFlag(state.currentQuestion)}
                isDemo={isPracticeMode}
                showAnswer={state.showAnswers || state.isReviewMode}
                questionNumber={state.currentQuestion}
                totalQuestions={totalQuestions}
                isPracticeMode={isPracticeMode}
                isReviewMode={state.isReviewMode}
              />
            )}

            <ExamNavigationControls
              currentQuestion={state.currentQuestion}
              totalQuestions={totalQuestions}
              showOnlyFlagged={state.showOnlyFlagged}
              filteredQuestions={filteredQuestions}
              isReviewMode={state.isReviewMode}
              onQuestionChange={(questionNumber) => updateState({ currentQuestion: questionNumber })}
              onBackToResults={state.isReviewMode ? handleBackToResults : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
