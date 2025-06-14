
import { Button } from "@/components/ui/button";

interface ExamStartScreenProps {
  examTitle: string;
  isPracticeMode: boolean;
  totalQuestions: number;
  timeLimit: number;
  passingScore: number;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  hasAccess: boolean;
  accessChecked: boolean;
  onStartExam: () => void;
  onBackToDashboard: () => void;
}

const ExamStartScreen = ({
  examTitle,
  isPracticeMode,
  totalQuestions,
  timeLimit,
  passingScore,
  randomizeQuestions,
  randomizeAnswers,
  hasAccess,
  accessChecked,
  onStartExam,
  onBackToDashboard,
}: ExamStartScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-lg shadow-elegant p-8 text-center border-border/50 animate-scale-in">
        <h1 className="text-2xl font-semibold mb-4 text-gradient">{examTitle}</h1>
        <div className="space-y-4 text-muted-foreground mb-8">
          <p><strong className="text-foreground">Mode:</strong> {isPracticeMode ? 'Practice' : 'Real Exam'}</p>
          <p><strong className="text-foreground">Questions:</strong> {totalQuestions}</p>
          {!isPracticeMode && <p><strong className="text-foreground">Time Limit:</strong> {timeLimit} minutes</p>}
          {!isPracticeMode && <p><strong className="text-foreground">Passing Score:</strong> {passingScore}%</p>}
          {randomizeQuestions && <p><strong className="text-foreground">Question Order:</strong> Randomized</p>}
          {randomizeAnswers && <p><strong className="text-foreground">Answer Options:</strong> Randomized</p>}
          <p><strong className="text-foreground">Features:</strong></p>
          <ul className="text-sm space-y-1">
            {isPracticeMode && <li>• No time limit</li>}
            {isPracticeMode && <li>• Show answer button available</li>}
            {isPracticeMode && <li>• Can finish early without answering all questions</li>}
            <li>• Flag questions for review</li>
            <li>• Filter to show only flagged questions</li>
            {isPracticeMode && <li>• Results not recorded</li>}
            {!isPracticeMode && <li>• Results recorded permanently</li>}
          </ul>
        </div>
        <div className="space-y-3">
          <Button 
            onClick={onStartExam} 
            className="w-full gradient-primary text-white shadow-elegant hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            disabled={!hasAccess || !accessChecked}
          >
            Start {isPracticeMode ? 'Practice' : 'Exam'}
          </Button>
          <Button onClick={onBackToDashboard} variant="outline" className="w-full border-border/50 hover:bg-accent/80">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamStartScreen;
