
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentAttempt {
  id: string;
  exam_title: string;
  score: number;
  passed: boolean;
  completed_at: string;
  is_practice_mode: boolean;
}

interface RecentActivityProps {
  recentAttempts: RecentAttempt[];
}

const RecentActivity = ({ recentAttempts }: RecentActivityProps) => {
  return (
    <Card className="card-elegant hover-lift border-enhanced">
      <CardHeader>
        <CardTitle className="text-subtitle flex items-center gap-3">
          <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAttempts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 status-info rounded-full mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8" />
            </div>
            <p className="text-body font-medium mb-2">No exam attempts yet</p>
            <p className="text-caption">Start practicing to see your progress here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-4 border-enhanced rounded-lg hover-lift bg-gradient-to-r from-card to-muted/20"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    attempt.passed ? "status-success" : "status-error"
                  }`}>
                    {attempt.passed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-body font-semibold flex items-center gap-2">
                      {attempt.exam_title}
                      {attempt.is_practice_mode && (
                        <BookOpen className="h-4 w-4 text-primary" />
                      )}
                    </h4>
                    <p className="text-caption">
                      {formatDistanceToNow(new Date(attempt.completed_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={attempt.is_practice_mode ? "secondary" : "default"}
                    className="font-semibold"
                  >
                    {attempt.is_practice_mode ? "Practice" : "Real"}
                  </Badge>
                  <Badge
                    variant={attempt.passed ? "default" : "destructive"}
                    className="font-bold text-base px-3 py-1"
                  >
                    {attempt.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
