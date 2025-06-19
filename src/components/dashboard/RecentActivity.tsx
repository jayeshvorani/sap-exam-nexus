
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
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAttempts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No exam attempts yet. Start practicing to see your progress here!
          </p>
        ) : (
          <div className="space-y-4">
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    attempt.passed ? "bg-success/10" : "bg-destructive/10"
                  }`}>
                    {attempt.passed ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      {attempt.exam_title}
                      {attempt.is_practice_mode && (
                        <BookOpen className="h-3 w-3 text-blue-500" />
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(attempt.completed_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={attempt.is_practice_mode ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {attempt.is_practice_mode ? "Practice" : "Real"}
                  </Badge>
                  <Badge
                    variant={attempt.passed ? "default" : "destructive"}
                    className="font-medium"
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
