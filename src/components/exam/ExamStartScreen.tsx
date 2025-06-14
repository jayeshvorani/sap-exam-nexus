
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">{examTitle}</h1>
        <div className="space-y-4 text-gray-600 mb-8">
          <p><strong>Mode:</strong> {isPracticeMode ? 'Practice' : 'Real Exam'}</p>
          <p><strong>Questions:</strong> {totalQuestions}</p>
          {!isPracticeMode && <p><strong>Time Limit:</strong> {timeLimit} minutes</p>}
          {!isPracticeMode && <p><strong>Passing Score:</strong> {passingScore}%</p>}
          {randomizeQuestions && <p><strong>Question Order:</strong> Randomized</p>}
          {randomizeAnswers && <p><strong>Answer Options:</strong> Randomized</p>}
          <p><strong>Features:</strong></p>
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
            className="w-full"
            disabled={!hasAccess || !accessChecked}
          >
            Start {isPracticeMode ? 'Practice' : 'Exam'}
          </Button>
          <Button onClick={onBackToDashboard} variant="outline" className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamStartScreen;
