
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Flag, Clock, Award, Home } from "lucide-react";

interface ExamResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  passingScore: number;
  flaggedCount: number;
  onRestart: () => void;
  onReview: () => void;
  onBackToDashboard: () => void;
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
  onBackToDashboard,
  examTitle,
  isDemo,
}: ExamResultsProps) => {
  const passed = score >= passingScore;
  const timeSpentMinutes = Math.floor(timeSpent / 60);
  const timeSpentSeconds = timeSpent % 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-border bg-card">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            passed ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"
          }`}>
            {passed ? (
              <Award className="w-8 h-8 text-success" />
            ) : (
              <XCircle className="w-8 h-8 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl text-foreground">
            {isDemo ? "Demo Complete!" : passed ? "Exam Passed!" : "Exam Failed"}
          </CardTitle>
          <p className="text-muted-foreground">{examTitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              passed ? "text-success" : "text-destructive"
            }`}>
              {score.toFixed(1)}%
            </div>
            <p className="text-muted-foreground">
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
              <CheckCircle className="w-6 h-6 text-success mx-auto" />
              <div className="text-sm text-muted-foreground">Correct</div>
              <div className="font-semibold text-foreground">{correctAnswers}</div>
            </div>
            <div className="space-y-2">
              <XCircle className="w-6 h-6 text-destructive mx-auto" />
              <div className="text-sm text-muted-foreground">Incorrect</div>
              <div className="font-semibold text-foreground">{totalQuestions - correctAnswers}</div>
            </div>
            <div className="space-y-2">
              <Flag className="w-6 h-6 text-warning mx-auto" />
              <div className="text-sm text-muted-foreground">Flagged</div>
              <div className="font-semibold text-foreground">{flaggedCount}</div>
            </div>
            <div className="space-y-2">
              <Clock className="w-6 h-6 text-info mx-auto" />
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="font-semibold text-foreground">
                {timeSpentMinutes}:{String(timeSpentSeconds).padStart(2, "0")}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={onReview} variant="outline" className="flex-1 border-border text-foreground hover:bg-accent hover:text-accent-foreground">
              Review Answers
            </Button>
            <Button onClick={onRestart} variant="outline" className="flex-1 border-border text-foreground hover:bg-accent hover:text-accent-foreground">
              {isDemo ? "Try Another Demo" : "Retake Exam"}
            </Button>
            <Button onClick={onBackToDashboard} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamResults;
