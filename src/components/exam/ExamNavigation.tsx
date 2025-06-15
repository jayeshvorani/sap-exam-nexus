
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Flag, CheckCircle, Circle } from "lucide-react";

interface ExamNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onQuestionSelect: (questionNumber: number) => void;
  onSubmitExam: () => void;
  isDemo: boolean;
  showOnlyFlagged?: boolean;
  onToggleFilter?: (show: boolean) => void;
  filteredQuestions?: number[];
  isReviewMode?: boolean;
}

const ExamNavigation = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  flaggedQuestions,
  onQuestionSelect,
  onSubmitExam,
  isDemo,
  showOnlyFlagged = false,
  onToggleFilter,
  filteredQuestions = [],
  isReviewMode = false,
}: ExamNavigationProps) => {
  const getQuestionStatus = (questionNumber: number) => {
    const isAnswered = answeredQuestions.has(questionNumber);
    const isFlagged = flaggedQuestions.has(questionNumber);
    const isCurrent = currentQuestion === questionNumber;

    if (isCurrent) {
      return "border-primary bg-primary/10 text-primary";
    }
    if (isAnswered && isFlagged) {
      return "border-warning bg-warning/10 text-warning";
    }
    if (isAnswered) {
      return "border-success bg-success/10 text-success";
    }
    if (isFlagged) {
      return "border-warning bg-warning/10 text-warning";
    }
    return "border-border bg-background text-muted-foreground hover:border-border/80";
  };

  const answeredCount = answeredQuestions.size;
  const flaggedCount = flaggedQuestions.size;
  const questionsToShow = showOnlyFlagged ? filteredQuestions : Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <Card className="h-full border-border bg-card flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg text-foreground">Navigation</CardTitle>
        <div className="space-y-2 text-sm text-foreground">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Answered: {answeredCount}/{totalQuestions}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Flag className="w-4 h-4 text-warning" />
            <span>Flagged: {flaggedCount}</span>
          </div>
          {showOnlyFlagged && (
            <div className="text-xs text-warning">
              Showing {questionsToShow.length} flagged question{questionsToShow.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        {flaggedCount > 0 && onToggleFilter && (
          <div className="flex items-center space-x-2 pt-2 border-t border-border">
            <Switch
              id="show-flagged"
              checked={showOnlyFlagged}
              onCheckedChange={onToggleFilter}
            />
            <Label htmlFor="show-flagged" className="text-sm text-foreground">
              Show only flagged
            </Label>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full px-6 py-4">
          <div className="grid grid-cols-5 gap-2 h-full content-start">
            {questionsToShow.map((questionNumber) => {
              const isAnswered = answeredQuestions.has(questionNumber);
              const isFlagged = flaggedQuestions.has(questionNumber);

              return (
                <Button
                  key={questionNumber}
                  variant="outline"
                  size="sm"
                  onClick={() => onQuestionSelect(questionNumber)}
                  className={`relative h-10 w-10 p-0 ${getQuestionStatus(questionNumber)}`}
                >
                  {questionNumber}
                  {isFlagged && (
                    <Flag className="w-2 h-2 absolute -top-1 -right-1 fill-current text-warning" />
                  )}
                  {isAnswered && !isFlagged && (
                    <CheckCircle className="w-2 h-2 absolute -top-1 -right-1 fill-current text-success" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamNavigation;
