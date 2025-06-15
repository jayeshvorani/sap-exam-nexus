
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Activity } from "lucide-react";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  if (recentAttempts.length === 0) {
    return null;
  }

  return (
    <Card className="border-border bg-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                  <span className="text-sm font-normal text-muted-foreground">
                    ({recentAttempts.length} attempts)
                  </span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your latest exam attempts and results
                </CardDescription>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform text-muted-foreground ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              {recentAttempts.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                  <div>
                    <h3 className="font-medium text-foreground">{attempt.exam_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(attempt.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${attempt.passed ? 'text-success' : 'text-destructive'}`}>
                      {attempt.score}%
                    </div>
                    <div className={`text-sm ${attempt.passed ? 'text-success' : 'text-destructive'}`}>
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RecentActivity;
