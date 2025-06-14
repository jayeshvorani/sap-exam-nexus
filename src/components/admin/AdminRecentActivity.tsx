
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Activity } from "lucide-react";
import { useState } from "react";

interface RecentActivityItem {
  id: string;
  user_name: string;
  exam_title: string;
  score: number;
  completed_at: string;
}

interface AdminRecentActivityProps {
  recentActivity: RecentActivityItem[];
}

const AdminRecentActivity = ({ recentActivity }: AdminRecentActivityProps) => {
  const [isRecentActivityOpen, setIsRecentActivityOpen] = useState(false);

  if (recentActivity.length === 0) {
    return null;
  }

  return (
    <div>
      <Card>
        <Collapsible open={isRecentActivityOpen} onOpenChange={setIsRecentActivityOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Exam Activity
                    <span className="text-sm font-normal text-muted-foreground">
                      ({Math.min(recentActivity.length, 5)} recent attempts)
                    </span>
                  </CardTitle>
                  <CardDescription>Latest completed exam attempts across the platform</CardDescription>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isRecentActivityOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{activity.user_name}</div>
                      <div className="text-sm text-muted-foreground">{activity.exam_title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(activity.completed_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${activity.score >= 70 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {activity.score}%
                      </div>
                      <div className={`text-xs ${activity.score >= 70 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {activity.score >= 70 ? 'Passed' : 'Failed'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default AdminRecentActivity;
