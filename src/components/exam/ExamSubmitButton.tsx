
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExamSubmitButtonProps {
  onSubmitExam: () => void;
  isDemo: boolean;
  answeredCount: number;
  totalQuestions: number;
  isReviewMode?: boolean;
}

const ExamSubmitButton = ({
  onSubmitExam,
  isDemo,
  answeredCount,
  totalQuestions,
  isReviewMode = false,
}: ExamSubmitButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      return "outline" as const;
    }
    if (isDemo) {
      return "default" as const;
    }
    return answeredCount === totalQuestions ? "default" as const : "outline" as const;
  };

  const getDialogTitle = () => {
    if (isDemo) {
      return "Finish Practice Session?";
    }
    return "Submit Exam?";
  };

  const getDialogDescription = () => {
    const unansweredCount = totalQuestions - answeredCount;
    
    if (isDemo) {
      return `Are you sure you want to finish this practice session? You have answered ${answeredCount} out of ${totalQuestions} questions.`;
    }
    
    if (unansweredCount > 0) {
      return `Are you sure you want to submit the exam? You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Once submitted, you cannot make any changes.`;
    }
    
    return "Are you sure you want to submit the exam? Once submitted, you cannot make any changes.";
  };

  const handleConfirmSubmit = () => {
    setIsDialogOpen(false);
    onSubmitExam();
  };

  // For review mode, no confirmation needed
  if (isReviewMode) {
    return (
      <Button onClick={onSubmitExam} variant="outline" className="w-full">
        {getSubmitButtonText()}
      </Button>
    );
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={getSubmitButtonVariant()} className="w-full">
          {getSubmitButtonText()}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getDialogTitle()}</AlertDialogTitle>
          <AlertDialogDescription>
            {getDialogDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmSubmit}>
            {isDemo ? "Finish Practice" : "Submit Exam"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExamSubmitButton;
