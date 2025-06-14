import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      return "border-blue-500 bg-blue-50 text-blue-700";
    }
    if (isAnswered && isFlagged) {
      return "border-orange-300 bg-orange-50 text-orange-700";
    }
    if (isAnswered) {
      return "border-green-300 bg-green-50 text-green-700";
    }
    if (isFlagged) {
      return "border-orange-300 bg-orange-50 text-orange-700";
    }
    return "border-gray-200 bg-white text-gray-600 hover:border-gray-300";
  };

  const answeredCount = answeredQuestions.size;
  const flaggedCount = flaggedQuestions.size;
  const questionsToShow = showOnlyFlagged ? filteredQuestions : Array.from({ length: totalQuestions }, (_, i) => i + 1);

  const getSubmitButtonText = () => {
    if (isReviewMode) {
      return "Back to Results";
    }
    if (isDemo) {
      return "Finish Practice";
    }
    return answeredCount === totalQuestions ? "Submit Exam" : `Submit Exam (${answeredCount}/${totalQuestions} answered)`;
  };

  const getSubmitButtonVariant = () => {
    if (isReviewMode) {
      return "outline";
    }
    if (isDemo) {
      return "default";
    }
    return answeredCount === totalQuestions ? "default" : "outline";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Navigation</CardTitle>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Answered: {answeredCount}/{totalQuestions}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Flag className="w-4 h-4 text-orange-600" />
            <span>Flagged: {flaggedCount}</span>
          </div>
          {showOnlyFlagged && (
            <div className="text-xs text-orange-600">
              Showing {questionsToShow.length} flagged question{questionsToShow.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        {flaggedCount > 0 && onToggleFilter && (
          <div className="flex items-center space-x-2 pt-2 border-t">
            <Switch
              id="show-flagged"
              checked={showOnlyFlagged}
              onCheckedChange={onToggleFilter}
            />
            <Label htmlFor="show-flagged" className="text-sm">
              Show only flagged
            </Label>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 px-6">
          <div className="grid grid-cols-5 gap-2 pb-4">
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
                    <Flag className="w-2 h-2 absolute -top-1 -right-1 fill-current text-orange-600" />
                  )}
                  {isAnswered && !isFlagged && (
                    <CheckCircle className="w-2 h-2 absolute -top-1 -right-1 fill-current text-green-600" />
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="px-6 pb-6 pt-4 border-t">
          <Button 
            onClick={onSubmitExam} 
            className="w-full"
            variant={getSubmitButtonVariant()}
          >
            {getSubmitButtonText()}
          </Button>
          {!isDemo && !isReviewMode && answeredCount < totalQuestions && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              You can submit with unanswered questions
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamNavigation;
