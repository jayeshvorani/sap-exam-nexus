
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
  isCorrect?: boolean;
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
  explanation?: string;
  category: string;
}

interface ExamQuestionDisplayProps {
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
  isReviewMode?: boolean;
}

const ExamQuestionDisplay = ({
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
  isReviewMode = false,
}: ExamQuestionDisplayProps) => {
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
      const answers = selectedAnswer.split(',').filter(a => a.trim() !== '');
      setSelectedAnswers(new Set(answers));
    } else {
      setSelectedAnswers(new Set());
    }
  }, [questionNumber, selectedAnswer, isMultiAnswer]);

  const handleMultiAnswerChange = (answerId: string, checked: boolean) => {
    const newSelectedAnswers = new Set(selectedAnswers);
    
    if (checked) {
      if (newSelectedAnswers.size < correctAnswersCount) {
        newSelectedAnswers.add(answerId);
      } else {
        return; // Don't allow more selections than correct answers
      }
    } else {
      newSelectedAnswers.delete(answerId);
    }
    
    setSelectedAnswers(newSelectedAnswers);
    onAnswerSelect(Array.from(newSelectedAnswers).join(','));
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
          <CardTitle className="text-lg font-medium text-foreground">
            Question {questionNumber} of {totalQuestions}
            <span className="text-sm text-muted-foreground ml-2">({question.category})</span>
          </CardTitle>
          <div className="flex space-x-2">
            {isPracticeMode && !isReviewMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleShowAnswer}
                className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950"
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
              className={isFlagged ? "text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950" : "text-muted-foreground hover:bg-muted"}
            >
              <Flag className={`w-4 h-4 ${isFlagged ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-foreground leading-relaxed">
          {question.text}
        </div>

        {isMultiAnswer && (
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Select {correctAnswersCount} correct answers
          </div>
        )}

        {isMultiAnswer ? (
          <div className="space-y-3">
            {question.answers.map((answer) => (
              <div
                key={answer.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedAnswers.has(answer.id)
                    ? "border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/50"
                    : "border-border hover:border-border/60 bg-background hover:bg-muted/50"
                } ${
                  shouldShowAnswer && answer.isCorrect
                    ? "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-950/50"
                    : ""
                } ${
                  shouldShowAnswer && selectedAnswers.has(answer.id) && !answer.isCorrect
                    ? "border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-950/50"
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
                    <span className="text-foreground">{answer.text}</span>
                    {shouldShowAnswer && answer.isCorrect && (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        ) : (
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
                    ? "border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/50"
                    : "border-border hover:border-border/60 bg-background hover:bg-muted/50"
                } ${
                  shouldShowAnswer && answer.isCorrect
                    ? "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-950/50"
                    : ""
                } ${
                  shouldShowAnswer && selectedAnswer === answer.id && !answer.isCorrect
                    ? "border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-950/50"
                    : ""
                }`}
              >
                <RadioGroupItem value={answer.id} id={answer.id} className="mt-1" />
                <Label htmlFor={answer.id} className="flex-1 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <span className="text-foreground">{answer.text}</span>
                    {shouldShowAnswer && answer.isCorrect && (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {shouldShowAnswer && question.explanation && (
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-foreground mb-2">Explanation:</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamQuestionDisplay;
