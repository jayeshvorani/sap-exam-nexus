
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Flag, CheckCircle, Eye, EyeOff } from "lucide-react";

interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean; // Only shown in demo mode
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
  explanation?: string;
  category: string;
}

interface ExamQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answerId: string) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  isDemo: boolean;
  showAnswer?: boolean;
  questionNumber: number;
  totalQuestions: number;
  isPracticeMode?: boolean;
}

const ExamQuestion = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isFlagged,
  onToggleFlag,
  isDemo,
  showAnswer = false,
  questionNumber,
  totalQuestions,
  isPracticeMode = false,
}: ExamQuestionProps) => {
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(new Set());
  
  const shouldShowAnswer = showAnswer || showPracticeAnswer;
  const correctAnswersCount = question.answers.filter(answer => answer.isCorrect).length;
  const isMultiAnswer = correctAnswersCount > 1;
  
  // Reset show answer state when question changes
  useEffect(() => {
    setShowPracticeAnswer(false);
  }, [questionNumber]);

  // Initialize selected answers for multi-answer questions
  useEffect(() => {
    if (isMultiAnswer && selectedAnswer) {
      // Parse selectedAnswer as comma-separated values for multi-answer
      const answers = selectedAnswer.split(',');
      setSelectedAnswers(new Set(answers));
    } else if (!isMultiAnswer) {
      setSelectedAnswers(new Set());
    }
  }, [selectedAnswer, isMultiAnswer]);

  const handleMultiAnswerChange = (answerId: string, checked: boolean) => {
    const newSelectedAnswers = new Set(selectedAnswers);
    
    if (checked) {
      // Only allow selection if under the limit
      if (newSelectedAnswers.size < correctAnswersCount) {
        newSelectedAnswers.add(answerId);
      }
    } else {
      newSelectedAnswers.delete(answerId);
    }
    
    setSelectedAnswers(newSelectedAnswers);
    
    // Convert to comma-separated string for storage
    const answersArray = Array.from(newSelectedAnswers);
    onAnswerSelect(answersArray.join(','));
  };

  const handleSingleAnswerChange = (answerId: string) => {
    onAnswerSelect(answerId);
  };

  const toggleShowAnswer = () => {
    setShowPracticeAnswer(!showPracticeAnswer);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            Question {questionNumber} of {totalQuestions}
            <span className="text-sm text-gray-500 ml-2">({question.category})</span>
          </CardTitle>
          <div className="flex space-x-2">
            {isPracticeMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleShowAnswer}
                className="text-blue-600 border-blue-600"
              >
                {showPracticeAnswer ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide Answer
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Show Answer
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFlag}
              className={isFlagged ? "text-orange-600" : "text-gray-400"}
            >
              <Flag className={`w-4 h-4 ${isFlagged ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-gray-900 leading-relaxed">
          {question.text}
        </div>

        {isMultiAnswer && (
          <div className="text-sm text-blue-600 font-medium">
            There are {correctAnswersCount} correct answers
          </div>
        )}

        {isMultiAnswer ? (
          // Multi-answer question with checkboxes
          <div className="space-y-3">
            {question.answers.map((answer) => (
              <div
                key={answer.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedAnswers.has(answer.id)
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  shouldShowAnswer && answer.isCorrect
                    ? "border-green-200 bg-green-50"
                    : ""
                } ${
                  shouldShowAnswer && selectedAnswers.has(answer.id) && !answer.isCorrect
                    ? "border-red-200 bg-red-50"
                    : ""
                }`}
              >
                <Checkbox
                  id={answer.id}
                  checked={selectedAnswers.has(answer.id)}
                  onCheckedChange={(checked) => handleMultiAnswerChange(answer.id, checked as boolean)}
                  disabled={!selectedAnswers.has(answer.id) && selectedAnswers.size >= correctAnswersCount}
                  className="mt-1"
                />
                <Label htmlFor={answer.id} className="flex-1 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <span>{answer.text}</span>
                    {shouldShowAnswer && answer.isCorrect && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        ) : (
          // Single-answer question with radio buttons
          <RadioGroup
            value={selectedAnswer || ""}
            onValueChange={handleSingleAnswerChange}
            className="space-y-3"
          >
            {question.answers.map((answer) => (
              <div
                key={answer.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedAnswer === answer.id
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  shouldShowAnswer && answer.isCorrect
                    ? "border-green-200 bg-green-50"
                    : ""
                } ${
                  shouldShowAnswer && selectedAnswer === answer.id && !answer.isCorrect
                    ? "border-red-200 bg-red-50"
                    : ""
                }`}
              >
                <RadioGroupItem value={answer.id} id={answer.id} className="mt-1" />
                <Label htmlFor={answer.id} className="flex-1 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <span>{answer.text}</span>
                    {shouldShowAnswer && answer.isCorrect && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {shouldShowAnswer && question.explanation && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamQuestion;
