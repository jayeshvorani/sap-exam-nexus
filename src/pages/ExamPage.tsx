
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ExamQuestion from "@/components/exam/ExamQuestion";
import ExamNavigation from "@/components/exam/ExamNavigation";
import ExamTimer from "@/components/exam/ExamTimer";
import ExamResults from "@/components/exam/ExamResults";
import ExamModeSelector from "@/components/exam/ExamModeSelector";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useExamQuestions } from "@/hooks/useExamQuestions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ExamPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const mode = searchParams.get('mode') || 'practice';
  const isPracticeMode = mode === 'practice';
  
  // Early redirect if no exam ID
  useEffect(() => {
    if (!id) {
      console.log('No exam ID provided, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
  }, [id, navigate]);
  
  const { questions, loading: questionsLoading, error: questionsError } = useExamQuestions(id || '');
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set<number>());
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);
  const [examDataLoading, setExamDataLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const totalQuestions = questions.length;
  const timeLimit = examData?.duration_minutes || 60;
  const passingScore = examData?.passing_percentage || 70;

  const answeredQuestions = new Set(Object.keys(answers).map(Number));

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

  // Log questions loading status
  useEffect(() => {
    console.log('Questions loading status:', { questionsLoading, questionsError, questionsCount: questions.length });
    if (questionsError) {
      console.error('Questions loading error:', questionsError);
    }
  }, [questionsLoading, questionsError, questions]);

  const getFilteredQuestions = () => {
    if (!showOnlyFlagged) return Array.from({ length: totalQuestions }, (_, i) => i + 1);
    return Array.from(flaggedQuestions).sort((a, b) => a - b);
  };

  const filteredQuestions = getFilteredQuestions();

  // Reset to first question when filter changes
  useEffect(() => {
    console.log('Filter changed:', { showOnlyFlagged, filteredQuestions, currentQuestion });
    if (showOnlyFlagged && filteredQuestions.length > 0) {
      console.log('Setting current question to first flagged:', filteredQuestions[0]);
      setCurrentQuestion(filteredQuestions[0]);
    } else if (!showOnlyFlagged) {
      console.log('Setting current question to 1');
      setCurrentQuestion(1);
    }
  }, [showOnlyFlagged, filteredQuestions.length]);

  const startExam = async () => {
    console.log('Start exam button clicked - examining state:', {
      user: !!user,
      id,
      examData: !!examData,
      hasAccess,
      accessChecked,
      questionsLoading,
      questionsCount: questions.length
    });
    
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
      setExamStarted(true);
      setStartTime(new Date());
    } catch (error: any) {
      console.error('Error starting exam:', error);
      toast({
        title: "Error",
        description: "Failed to start exam: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    console.log('Answer selected:', { currentQuestion, answerId });
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
  };

  const handleToggleFlag = () => {
    console.log('Toggle flag clicked for question:', currentQuestion);
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
        console.log('Unflagged question:', currentQuestion);
      } else {
        newSet.add(currentQuestion);
        console.log('Flagged question:', currentQuestion);
      }
      return newSet;
    });
  };

  const handleQuestionSelect = (questionNumber: number) => {
    console.log('Question select clicked:', questionNumber, 'Current state:', {
      showOnlyFlagged,
      filteredQuestions,
      totalQuestions
    });
    setCurrentQuestion(questionNumber);
  };

  const handleNext = () => {
    const questionsToNavigate = showOnlyFlagged ? filteredQuestions : Array.from({ length: totalQuestions }, (_, i) => i + 1);
    const currentIndex = questionsToNavigate.indexOf(currentQuestion);
    
    console.log('Next clicked - DETAILED DEBUG:', { 
      showOnlyFlagged, 
      currentQuestion, 
      questionsToNavigate, 
      currentIndex,
      nextQuestion: currentIndex !== -1 && currentIndex < questionsToNavigate.length - 1 ? questionsToNavigate[currentIndex + 1] : 'none',
      canGoNext: currentIndex !== -1 && currentIndex < questionsToNavigate.length - 1
    });
    
    if (currentIndex !== -1 && currentIndex < questionsToNavigate.length - 1) {
      const nextQ = questionsToNavigate[currentIndex + 1];
      console.log('Moving to next question:', nextQ);
      setCurrentQuestion(nextQ);
    } else {
      console.log('Cannot go to next question - at end or invalid index');
    }
  };

  const handlePrevious = () => {
    const questionsToNavigate = showOnlyFlagged ? filteredQuestions : Array.from({ length: totalQuestions }, (_, i) => i + 1);
    const currentIndex = questionsToNavigate.indexOf(currentQuestion);
    
    console.log('Previous clicked - DETAILED DEBUG:', { 
      showOnlyFlagged, 
      currentQuestion, 
      questionsToNavigate, 
      currentIndex,
      prevQuestion: currentIndex !== -1 && currentIndex > 0 ? questionsToNavigate[currentIndex - 1] : 'none',
      canGoPrev: currentIndex !== -1 && currentIndex > 0
    });
    
    if (currentIndex !== -1 && currentIndex > 0) {
      const prevQ = questionsToNavigate[currentIndex - 1];
      console.log('Moving to previous question:', prevQ);
      setCurrentQuestion(prevQ);
    } else {
      console.log('Cannot go to previous question - at beginning or invalid index');
    }
  };

  const handleSubmitExam = async () => {
    console.log('handleSubmitExam called - DETAILED DEBUG:', {
      isPracticeMode,
      examFinished,
      showAnswers,
      answeredQuestions: answeredQuestions.size,
      totalQuestions,
      user: !!user,
      id
    });
    
    const endTimeValue = new Date();
    console.log('Setting endTime and examFinished to true');
    setEndTime(endTimeValue);
    setExamFinished(true);
    
    if (isPracticeMode) {
      console.log('Practice mode - exam completed');
    } else {
      console.log('Real exam mode - saving results');
      // Save exam results for real exam
      try {
        const score = calculateResults().score;
        const passed = score >= passingScore;

        await supabase
          .from('exam_attempts')
          .update({
            answers: answers,
            flagged_questions: Array.from(flaggedQuestions),
            score: Math.round(score),
            passed: passed,
            is_completed: true,
            end_time: endTimeValue.toISOString()
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
    
    console.log('handleSubmitExam completed - final state should be:', {
      examFinished: true,
      showAnswers: isPracticeMode
    });
  };

  const handleTimeUp = () => {
    handleSubmitExam();
  };

  const calculateResults = () => {
    let correctCount = 0;
    
    questions.forEach((question, index) => {
      const questionNumber = index + 1;
      const selectedAnswer = answers[questionNumber];
      
      if (selectedAnswer && question.correct_answers.includes(parseInt(selectedAnswer))) {
        correctCount++;
      }
    });

    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const timeSpent = startTime && endTime 
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

    return {
      score,
      correctAnswers: correctCount,
      timeSpent,
      flaggedCount: flaggedQuestions.size
    };
  };

  const handleRestart = () => {
    setCurrentQuestion(1);
    setAnswers({});
    setFlaggedQuestions(new Set());
    setExamStarted(false);
    setExamFinished(false);
    setStartTime(null);
    setEndTime(null);
    setShowAnswers(false);
    setShowOnlyFlagged(false);
    setIsReviewMode(false);
  };

  const handleReview = () => {
    setShowAnswers(true);
    setCurrentQuestion(1);
    setShowOnlyFlagged(false);
    setIsReviewMode(true);
  };

  const handleBackToResults = () => {
    setIsReviewMode(false);
    setShowAnswers(false);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Show loading while fetching exam data
  if (examDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading exam data...</p>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold mb-4">Error Loading Questions</h1>
          <p className="text-gray-600 mb-6">Failed to load exam questions: {questionsError}</p>
          <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (accessChecked && !hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have access to this exam.</p>
          <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (questionsLoading || !accessChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>
            {questionsLoading && "Loading questions..."}
            {!accessChecked && "Checking access..."}
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold mb-4">No Questions Available</h1>
          <p className="text-gray-600 mb-6">This exam doesn't have any questions yet.</p>
          <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">{examData?.title || 'Exam'}</h1>
          <div className="space-y-4 text-gray-600 mb-8">
            <p><strong>Mode:</strong> {isPracticeMode ? 'Practice' : 'Real Exam'}</p>
            <p><strong>Questions:</strong> {totalQuestions}</p>
            {!isPracticeMode && <p><strong>Time Limit:</strong> {timeLimit} minutes</p>}
            {!isPracticeMode && <p><strong>Passing Score:</strong> {passingScore}%</p>}
            <p><strong>Features:</strong></p>
            <ul className="text-sm space-y-1">
              {isPracticeMode && <li>• No time limit</li>}
              {isPracticeMode && <li>• Show answer button available</li>}
              {isPracticeMode && <li>• Can finish early without answering all questions</li>}
              <li>• Flag questions for review</li>
              <li>• Filter to show only flagged questions</li>
              {isPracticeMode && <li>• Results not recorded</li>}
              {!isPracticeMode && <li>• Results recorded permanently</li>}
            </ul>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={startExam} 
              className="w-full"
              disabled={!hasAccess || !accessChecked}
            >
              Start {isPracticeMode ? 'Practice' : 'Exam'}
            </Button>
            <Button onClick={handleBackToDashboard} variant="outline" className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show results when exam is finished and not in review mode
  if (examFinished && !isReviewMode) {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <ExamResults
          {...results}
          totalQuestions={totalQuestions}
          passingScore={passingScore}
          onRestart={handleRestart}
          onReview={handleReview}
          examTitle={examData?.title || 'Exam'}
          isDemo={isPracticeMode}
        />
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion - 1];
  const questionsToNavigate = showOnlyFlagged ? filteredQuestions : Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const currentIndex = questionsToNavigate.indexOf(currentQuestion);
  const isNextDisabled = currentIndex === -1 || currentIndex === questionsToNavigate.length - 1;
  const isPrevDisabled = currentIndex === -1 || currentIndex === 0;

  console.log('Render - Navigation state:', {
    showOnlyFlagged,
    currentQuestion,
    questionsToNavigate,
    currentIndex,
    isNextDisabled,
    isPrevDisabled,
    filteredQuestions
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              {examData?.title || 'Exam'} - {isPracticeMode ? 'Practice Mode' : 'Real Exam'}
              {isReviewMode && " - Review Mode"}
            </h1>
            {showOnlyFlagged && (
              <p className="text-sm text-orange-600">Showing only flagged questions ({filteredQuestions.length} questions)</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {examStarted && !examFinished && !isPracticeMode && (
              <ExamTimer
                totalTimeMinutes={timeLimit}
                onTimeUp={handleTimeUp}
                isActive={true}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <ExamNavigation
              totalQuestions={totalQuestions}
              currentQuestion={currentQuestion}
              answeredQuestions={answeredQuestions}
              flaggedQuestions={flaggedQuestions}
              onQuestionSelect={handleQuestionSelect}
              onSubmitExam={isReviewMode ? handleBackToResults : handleSubmitExam}
              isDemo={isPracticeMode}
              showOnlyFlagged={showOnlyFlagged}
              onToggleFilter={setShowOnlyFlagged}
              filteredQuestions={filteredQuestions}
              isReviewMode={isReviewMode}
            />
          </div>

          {/* Question Content */}
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
                selectedAnswer={answers[currentQuestion] || null}
                onAnswerSelect={handleAnswerSelect}
                isFlagged={flaggedQuestions.has(currentQuestion)}
                onToggleFlag={handleToggleFlag}
                isDemo={isPracticeMode}
                showAnswer={showAnswers || isReviewMode}
                questionNumber={currentQuestion}
                totalQuestions={totalQuestions}
                isPracticeMode={isPracticeMode}
                isReviewMode={isReviewMode}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Previous button clicked');
                  handlePrevious();
                }}
                disabled={isPrevDisabled}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {isReviewMode && (
                <Button onClick={handleBackToResults} variant="outline">
                  Back to Results
                </Button>
              )}
              
              <Button
                onClick={() => {
                  console.log('Next button clicked');
                  handleNext();
                }}
                disabled={isNextDisabled}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
