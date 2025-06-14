
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Flag, Clock, Award } from "lucide-react";

interface ExamResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  passingScore: number;
  flaggedCount: number;
  onRestart: () => void;
  onReview: () => void;
  examTitle: string;
  isDemo: boolean;
}

const ExamResults = ({
  score,
  totalQuestions,
  correctAnswers,
  timeSpent,
  passingScore,
  flaggedCount,
  onRestart,
  onReview,
  examTitle,
  isDemo,
}: ExamResultsProps) => {
  const passed = score >= passingScore;
  const timeSpentMinutes = Math.floor(timeSpent / 60);
  const timeSpentSeconds = timeSpent % 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            passed ? "bg-green-100" : "bg-red-100"
          }`}>
            {passed ? (
              <Award className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isDemo ? "Demo Complete!" : passed ? "Exam Passed!" : "Exam Failed"}
          </CardTitle>
          <p className="text-gray-600">{examTitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              passed ? "text-green-600" : "text-red-600"
            }`}>
              {score.toFixed(1)}%
            </div>
            <p className="text-gray-600">
              {correctAnswers} out of {totalQuestions} questions correct
              {!isDemo && (
                <span className="block text-sm mt-1">
                  Passing score: {passingScore}%
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
              <div className="text-sm text-gray-600">Correct</div>
              <div className="font-semibold">{correctAnswers}</div>
            </div>
            <div className="space-y-2">
              <XCircle className="w-6 h-6 text-red-600 mx-auto" />
              <div className="text-sm text-gray-600">Incorrect</div>
              <div className="font-semibold">{totalQuestions - correctAnswers}</div>
            </div>
            <div className="space-y-2">
              <Flag className="w-6 h-6 text-orange-600 mx-auto" />
              <div className="text-sm text-gray-600">Flagged</div>
              <div className="font-semibold">{flaggedCount}</div>
            </div>
            <div className="space-y-2">
              <Clock className="w-6 h-6 text-blue-600 mx-auto" />
              <div className="text-sm text-gray-600">Time</div>
              <div className="font-semibold">
                {timeSpentMinutes}:{String(timeSpentSeconds).padStart(2, "0")}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={onReview} variant="outline" className="flex-1">
              Review Answers
            </Button>
            <Button onClick={onRestart} className="flex-1">
              {isDemo ? "Try Another Demo" : "Retake Exam"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamResults;
