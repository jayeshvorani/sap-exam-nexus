
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
}

const ExamQuestionDisplay = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  currentQuestionIndex,
  totalQuestions,
}: ExamQuestionDisplayProps) => {
  const isMultipleChoice = question.correct_answers.length > 1;
  const maxSelections = question.correct_answers.length;

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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">{question.question_text}</h2>
        
        {question.image_url && (
          <div className="mb-4">
            <img 
              src={question.image_url} 
              alt="Question image" 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}

        <div className="space-y-3">
          {isMultipleChoice ? (
            // Multiple choice - use checkboxes with selection limit
            <>
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Select {maxSelections} answers:</strong> This question has {maxSelections} correct answers. 
                  {selectedAnswers.length > 0 && (
                    <span className="ml-2">({selectedAnswers.length}/{maxSelections} selected)</span>
                  )}
                </p>
              </div>
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers.includes(index);
                const isDisabled = !isSelected && selectedAnswers.length >= maxSelections;
                
                return (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 ${isDisabled ? 'opacity-50' : ''}`}>
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
                      {option}
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
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamQuestionDisplay;
