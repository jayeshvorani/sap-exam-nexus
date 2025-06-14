
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ExamQuestion from "@/components/exam/ExamQuestion";
import ExamNavigation from "@/components/exam/ExamNavigation";
import ExamTimer from "@/components/exam/ExamTimer";
import ExamResults from "@/components/exam/ExamResults";
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
  
  const { questions, loading: questionsLoading } = useExamQuestions(id || '');
  
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

  const totalQuestions = questions.length;
  const timeLimit = examData?.duration_minutes || 60;
  const passingScore = examData?.passing_percentage || 70;

  const answeredQuestions = new Set(Object.keys(answers).map(Number));

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setExamData(data);
      } catch (error: any) {
        console.error('Error fetching exam:', error);
        toast({
          title: "Error",
          description: "Failed to load exam data",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    };

    fetchExamData();
  }, [id, navigate, toast]);

  // Check if user has access to this exam
  useEffect(() => {
    const checkExamAccess = async () => {
      if (!id || !user || !examData) return;

      try {
        const { data, error } = await supabase
          .from('user_exam_assignments')
          .select('id')
          .eq('user_id', user.id)
          .eq('exam_id', id)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          toast({
            title: "Access Denied",
            description: "You don't have access to this exam",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking exam access:', error);
        navigate('/dashboard');
      }
    };

    checkExamAccess();
  }, [id, user, examData, navigate, toast]);

  const getFilteredQuestions = () => {
    if (!showOnlyFlagged) return Array.from({ length: totalQuestions }, (_, i) => i + 1);
    return Array.from(flaggedQuestions).sort((a, b) => a - b);
  };

  const filteredQuestions = getFilteredQuestions();
  const currentFilteredIndex = filteredQuestions.indexOf(currentQuestion);

  const startExam = async () => {
    if (!user || !id) return;

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

      setExamStarted(true);
      setStartTime(new Date());
    } catch (error: any) {
      console.error('Error starting exam:', error);
      toast({
        title: "Error",
        description: "Failed to start exam",
        variant: "destructive",
      });
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const handleQuestionSelect = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  };

  const handleNext = () => {
    if (showOnlyFlagged) {
      const nextIndex = currentFilteredIndex + 1;
      if (nextIndex < filteredQuestions.length) {
        setCurrentQuestion(filteredQuestions[nextIndex]);
      }
    } else {
      if (currentQuestion < totalQuestions) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (showOnlyFlagged) {
      const prevIndex = currentFilteredIndex - 1;
      if (prevIndex >= 0) {
        setCurrentQuestion(filteredQuestions[prevIndex]);
      }
    } else {
      if (currentQuestion > 1) {
        setCurrentQuestion(currentQuestion - 1);
      }
    }
  };

  const handleSubmitExam = async () => {
    const endTimeValue = new Date();
    setEndTime(endTimeValue);
    setExamFinished(true);
    
    if (isPracticeMode) {
      setShowAnswers(true);
    } else {
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
  };

  const handleReview = () => {
    setShowAnswers(true);
    setCurrentQuestion(1);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (questionsLoading || !examData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading exam...</p>
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
          <h1 className="text-2xl font-semibold mb-4">{examData.title}</h1>
          <div className="space-y-4 text-gray-600 mb-8">
            <p><strong>Mode:</strong> {isPracticeMode ? 'Practice' : 'Real Exam'}</p>
            <p><strong>Questions:</strong> {totalQuestions}</p>
            {!isPracticeMode && <p><strong>Time Limit:</strong> {timeLimit} minutes</p>}
            {!isPracticeMode && <p><strong>Passing Score:</strong> {passingScore}%</p>}
            <p><strong>Features:</strong></p>
            <ul className="text-sm space-y-1">
              {isPracticeMode && <li>• No time limit</li>}
              {isPracticeMode && <li>• Show answer button available</li>}
              <li>• Flag questions for review</li>
              {isPracticeMode && <li>• Results not recorded</li>}
              {!isPracticeMode && <li>• Results recorded permanently</li>}
            </ul>
          </div>
          <div className="space-y-3">
            <Button onClick={startExam} className="w-full">
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

  if (examFinished && !showAnswers) {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <ExamResults
          {...results}
          totalQuestions={totalQuestions}
          passingScore={passingScore}
          onRestart={handleRestart}
          onReview={handleReview}
          examTitle={examData.title}
          isDemo={isPracticeMode}
        />
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion - 1];
  const isNextDisabled = showOnlyFlagged 
    ? currentFilteredIndex === filteredQuestions.length - 1
    : currentQuestion === totalQuestions;
  const isPrevDisabled = showOnlyFlagged 
    ? currentFilteredIndex === 0
    : currentQuestion === 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              {examData.title} - {isPracticeMode ? 'Practice Mode' : 'Real Exam'}
              {showAnswers && " - Review Mode"}
            </h1>
            {showOnlyFlagged && (
              <p className="text-sm text-orange-600">Showing only flagged questions</p>
            )}
          </div>
          {examStarted && !examFinished && !isPracticeMode && (
            <ExamTimer
              totalTimeMinutes={timeLimit}
              onTimeUp={handleTimeUp}
              isActive={true}
            />
          )}
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
              onSubmitExam={handleSubmitExam}
              isDemo={isPracticeMode}
              showOnlyFlagged={showOnlyFlagged}
              onToggleFilter={setShowOnlyFlagged}
              filteredQuestions={filteredQuestions}
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
                showAnswer={showAnswers}
                questionNumber={currentQuestion}
                totalQuestions={totalQuestions}
                isPracticeMode={isPracticeMode}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isPrevDisabled}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
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
