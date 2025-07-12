
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getNavigationQuestions } from "@/utils/examUtils";

interface ExamNavigationControlsProps {
  currentQuestion: number;
  totalQuestions: number;
  showOnlyFlagged: boolean;
  filteredQuestions: number[];
  isReviewMode: boolean;
  onQuestionChange: (questionNumber: number) => void;
  onBackToResults?: () => void;
}

const ExamNavigationControls = ({
  currentQuestion,
  totalQuestions,
  showOnlyFlagged,
  filteredQuestions,
  isReviewMode,
  onQuestionChange,
  onBackToResults,
}: ExamNavigationControlsProps) => {
  const questionsToNavigate = getNavigationQuestions(totalQuestions, showOnlyFlagged, filteredQuestions);
  
  // Safety check: if no questions to navigate, don't render anything
  if (!questionsToNavigate || questionsToNavigate.length === 0) {
    return null;
  }
  
  const currentIndex = questionsToNavigate.indexOf(currentQuestion);
  const isNextDisabled = currentIndex === -1 || currentIndex === questionsToNavigate.length - 1;
  const isPrevDisabled = currentIndex === -1 || currentIndex === 0;

  const handleNext = () => {
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
      onQuestionChange(nextQ);
    } else {
      console.log('Cannot go to next question - at end or invalid index');
    }
  };

  const handlePrevious = () => {
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
      onQuestionChange(prevQ);
    } else {
      console.log('Cannot go to previous question - at beginning or invalid index');
    }
  };

  return (
    <div className="flex justify-between items-center w-full max-w-2xl mx-auto">
      <div className="w-32">
        <Button
          variant="outline"
          onClick={() => {
            console.log('Previous button clicked');
            handlePrevious();
          }}
          disabled={isPrevDisabled}
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
      </div>

      <div className="flex-1 flex justify-center">
        {isReviewMode && onBackToResults && (
          <Button onClick={onBackToResults} variant="outline">
            Back to Results
          </Button>
        )}
      </div>
      
      <div className="w-32">
        <Button
          onClick={() => {
            console.log('Next button clicked');
            handleNext();
          }}
          disabled={isNextDisabled}
          className="w-full"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ExamNavigationControls;
