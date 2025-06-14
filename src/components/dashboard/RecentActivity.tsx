
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentAttempt {
  id: string;
  exam_title: string;
  score: number;
  passed: boolean;
  completed_at: string;
}

interface RecentActivityProps {
  recentAttempts: RecentAttempt[];
}

const RecentActivity = ({ recentAttempts }: RecentActivityProps) => {
  if (recentAttempts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest exam attempts and results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAttempts.slice(0, 5).map((attempt) => (
            <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{attempt.exam_title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(attempt.completed_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {attempt.score}%
                </div>
                <div className={`text-sm ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {attempt.passed ? 'Passed' : 'Failed'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
