
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import ExamQuestionDisplay from "@/components/exam/ExamQuestionDisplay";
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
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_exam_assignments')
          .select('id')
          .eq('user_id', user.id)
          .eq('exam_id', id)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          setHasAccess(false);
        } else {
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
    if (state.showOnlyFlagged && filteredQuestions.length > 0) {
      updateState({ currentQuestion: filteredQuestions[0] });
    } else if (!state.showOnlyFlagged) {
      updateState({ currentQuestion: 1 });
    }
  }, [state.showOnlyFlagged, filteredQuestions.length, updateState]);

  const startExam = async () => {
    if (!user || !id) {
      toast({
        title: "Error",
        description: "Missing user or exam information",
        variant: "destructive",
      });
      return;
    }

    try {
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

      if (error) throw error;

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
    finishExam();
    
    if (!isPracticeMode) {
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
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {examData?.title || 'Exam'} - {isPracticeMode ? 'Practice Mode' : 'Real Exam'}
              {state.isReviewMode && " - Review Mode"}
            </h1>
            {state.showOnlyFlagged && (
              <p className="text-sm text-orange-600 dark:text-orange-400">Showing only flagged questions ({filteredQuestions.length} questions)</p>
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
              <ExamQuestionDisplay
                question={{
                  id: currentQuestionData.id,
                  question_text: currentQuestionData.question_text,
                  options: currentQuestionData.options || [],
                  correct_answers: currentQuestionData.correct_answers || [],
                  image_url: currentQuestionData.image_url
                }}
                selectedAnswers={state.answers[state.currentQuestion] ? [parseInt(state.answers[state.currentQuestion])] : []}
                onAnswerSelect={(answerIndex) => handleAnswerSelect(state.currentQuestion, answerIndex.toString())}
                onNext={() => {
                  const nextQuestion = Math.min(state.currentQuestion + 1, totalQuestions);
                  updateState({ currentQuestion: nextQuestion });
                }}
                onPrevious={() => {
                  const prevQuestion = Math.max(state.currentQuestion - 1, 1);
                  updateState({ currentQuestion: prevQuestion });
                }}
                currentQuestionIndex={state.currentQuestion - 1}
                totalQuestions={totalQuestions}
                canGoNext={state.currentQuestion < totalQuestions}
                canGoPrevious={state.currentQuestion > 1}
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
