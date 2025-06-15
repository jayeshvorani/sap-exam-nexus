
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

interface ExamQuestionDisplayProps {
  question: {
    id: string;
    question_text: string;
    options: string[];
    correct_answers: number[];
    image_url?: string;
  };
  selectedAnswers: number[];
  onAnswerSelect: (answerIndex: number) => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  isPracticeMode?: boolean;
  isReviewMode?: boolean;
}

const ExamQuestionDisplay = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  currentQuestionIndex,
  totalQuestions,
  isPracticeMode = false,
  isReviewMode = false,
}: ExamQuestionDisplayProps) => {
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const isMultipleChoice = question.correct_answers.length > 1;
  const maxSelections = question.correct_answers.length;

  // Reset show answer state when question changes
  useEffect(() => {
    setShowPracticeAnswer(false);
  }, [currentQuestionIndex]);

  const shouldShowAnswer = isReviewMode || showPracticeAnswer;

  const handleSingleAnswerSelect = (value: string) => {
    const answerIndex = parseInt(value);
    onAnswerSelect(answerIndex);
  };

  const handleMultipleAnswerSelect = (answerIndex: number, checked: boolean) => {
    // If trying to check and already at max selections, don't allow
    if (checked && selectedAnswers.length >= maxSelections) {
      return;
    }
    onAnswerSelect(answerIndex);
  };

  const toggleShowAnswer = () => {
    setShowPracticeAnswer(!showPracticeAnswer);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          {isPracticeMode && !isReviewMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleShowAnswer}
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
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
        </div>
        
        <h2 className="text-xl font-semibold mb-4 text-foreground">{question.question_text}</h2>
        
        {question.image_url && (
          <div className="mb-4">
            <img 
              src={question.image_url} 
              alt="Question image" 
              className="max-w-full h-auto rounded-lg border border-border"
            />
          </div>
        )}

        <div className="space-y-3">
          {isMultipleChoice ? (
            // Multiple choice - use checkboxes with selection limit
            <>
              <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground font-medium">
                  <strong>Select {maxSelections} answers:</strong> This question has {maxSelections} correct answers. 
                  {selectedAnswers.length > 0 && (
                    <span className="ml-2">({selectedAnswers.length}/{maxSelections} selected)</span>
                  )}
                </p>
              </div>
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers.includes(index);
                const isDisabled = !isSelected && selectedAnswers.length >= maxSelections;
                const isCorrect = question.correct_answers.includes(index);
                
                return (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
                    isDisabled ? 'opacity-50' : ''
                  } ${
                    shouldShowAnswer && isCorrect
                      ? "border-success/30 bg-success/10"
                      : ""
                  } ${
                    shouldShowAnswer && isSelected && !isCorrect
                      ? "border-destructive/30 bg-destructive/10"
                      : ""
                  }`}>
                    <Checkbox
                      id={`option-${index}`}
                      checked={isSelected}
                      disabled={isDisabled}
                      onCheckedChange={(checked) => handleMultipleAnswerSelect(index, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className={`flex-1 cursor-pointer text-sm font-medium leading-none ${isDisabled ? 'cursor-not-allowed opacity-70' : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'}`}
                    >
                      <div className="flex items-start justify-between">
                        <span>{option}</span>
                        {shouldShowAnswer && isCorrect && (
                          <CheckCircle className="w-4 h-4 text-success ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </>
          ) : (
            // Single choice - use radio buttons
            <RadioGroup
              value={selectedAnswers.length > 0 ? selectedAnswers[0].toString() : ""}
              onValueChange={handleSingleAnswerSelect}
              className="space-y-3"
            >
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers.includes(index);
                const isCorrect = question.correct_answers.includes(index);
                
                return (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
                    shouldShowAnswer && isCorrect
                      ? "border-success/30 bg-success/10"
                      : ""
                  } ${
                    shouldShowAnswer && isSelected && !isCorrect
                      ? "border-destructive/30 bg-destructive/10"
                      : ""
                  }`}>
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <div className="flex items-start justify-between">
                        <span>{option}</span>
                        {shouldShowAnswer && isCorrect && (
                          <CheckCircle className="w-4 h-4 text-success ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamQuestionDisplay;
