
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ExamQuestion from "@/components/exam/ExamQuestion";
import ExamNavigation from "@/components/exam/ExamNavigation";
import ExamTimer from "@/components/exam/ExamTimer";
import ExamResults from "@/components/exam/ExamResults";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Sample exam data - in real app this would come from Supabase
const sampleQuestions = [
  {
    id: "1",
    text: "Which of the following is a key characteristic of SAP S/4HANA?",
    answers: [
      { id: "a", text: "Based on traditional row storage", isCorrect: false },
      { id: "b", text: "Uses in-memory computing with SAP HANA", isCorrect: true },
      { id: "c", text: "Only available on-premise", isCorrect: false },
      { id: "d", text: "Requires separate analytics tools", isCorrect: false },
    ],
    explanation: "SAP S/4HANA is built on SAP HANA's in-memory database platform, enabling real-time analytics and faster processing.",
    category: "SAP Basics"
  },
  {
    id: "2",
    text: "What does MRP stand for in SAP?",
    answers: [
      { id: "a", text: "Master Resource Planning", isCorrect: false },
      { id: "b", text: "Material Requirements Planning", isCorrect: true },
      { id: "c", text: "Manufacturing Resource Processing", isCorrect: false },
      { id: "d", text: "Material Resource Processing", isCorrect: false },
    ],
    explanation: "MRP (Material Requirements Planning) is a production planning and inventory control system used to manage manufacturing processes.",
    category: "Materials Management"
  },
  {
    id: "3",
    text: "Which transaction code is used to create a sales order in SAP?",
    answers: [
      { id: "a", text: "VA01", isCorrect: true },
      { id: "b", text: "VL01N", isCorrect: false },
      { id: "c", text: "VF01", isCorrect: false },
      { id: "d", text: "VA03", isCorrect: false },
    ],
    explanation: "VA01 is the transaction code for creating sales orders in SAP. VA03 is for displaying sales orders.",
    category: "Sales & Distribution"
  },
];

const ExamPage = () => {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set<number>());
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isDemo] = useState(id === "demo");
  const [showAnswers, setShowAnswers] = useState(false);

  const totalQuestions = sampleQuestions.length;
  const timeLimit = isDemo ? 10 : 60; // Demo: 10 minutes, Real exam: 60 minutes
  const passingScore = 70;

  const answeredQuestions = new Set(Object.keys(answers).map(Number));

  const startExam = () => {
    setExamStarted(true);
    setStartTime(new Date());
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
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = () => {
    setEndTime(new Date());
    setExamFinished(true);
    if (isDemo) {
      setShowAnswers(true);
    }
  };

  const handleTimeUp = () => {
    handleSubmitExam();
  };

  const calculateResults = () => {
    let correctCount = 0;
    
    sampleQuestions.forEach((question, index) => {
      const questionNumber = index + 1;
      const selectedAnswer = answers[questionNumber];
      const correctAnswer = question.answers.find(a => a.isCorrect);
      
      if (selectedAnswer === correctAnswer?.id) {
        correctCount++;
      }
    });

    const score = (correctCount / totalQuestions) * 100;
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

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">
            {isDemo ? "Demo Exam" : `Exam ${id}`}
          </h1>
          <div className="space-y-4 text-gray-600 mb-8">
            <p><strong>Questions:</strong> {totalQuestions}</p>
            <p><strong>Time Limit:</strong> {timeLimit} minutes</p>
            {!isDemo && <p><strong>Passing Score:</strong> {passingScore}%</p>}
            <p><strong>Mode:</strong> {isDemo ? "Demo (answers shown)" : "Exam"}</p>
          </div>
          <Button onClick={startExam} className="w-full">
            Start {isDemo ? "Demo" : "Exam"}
          </Button>
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
          examTitle={isDemo ? "Demo Exam" : `Exam ${id}`}
          isDemo={isDemo}
        />
      </div>
    );
  }

  const currentQuestionData = sampleQuestions[currentQuestion - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">
            {isDemo ? "Demo Exam" : `Exam ${id}`}
            {showAnswers && " - Review Mode"}
          </h1>
          {examStarted && !examFinished && (
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
              isDemo={isDemo}
            />
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3 space-y-6">
            <ExamQuestion
              question={currentQuestionData}
              selectedAnswer={answers[currentQuestion] || null}
              onAnswerSelect={handleAnswerSelect}
              isFlagged={flaggedQuestions.has(currentQuestion)}
              onToggleFlag={handleToggleFlag}
              isDemo={isDemo}
              showAnswer={showAnswers}
              questionNumber={currentQuestion}
              totalQuestions={totalQuestions}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={currentQuestion === totalQuestions}
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
