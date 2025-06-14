
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle } from "lucide-react";

interface ExamTimerProps {
  totalTimeMinutes: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const ExamTimer = ({ totalTimeMinutes, onTimeUp, isActive }: ExamTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(totalTimeMinutes * 60); // Convert to seconds

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (totalTimeMinutes * 60)) * 100;

  const getTimeColor = () => {
    if (percentage <= 10) return "text-red-600";
    if (percentage <= 25) return "text-orange-600";
    return "text-gray-700";
  };

  const getProgressColor = () => {
    if (percentage <= 10) return "bg-red-500";
    if (percentage <= 25) return "bg-orange-500";
    return "bg-blue-500";
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {percentage <= 25 ? (
              <AlertTriangle className={`w-5 h-5 ${getTimeColor()}`} />
            ) : (
              <Clock className="w-5 h-5 text-gray-600" />
            )}
            <span className={`font-mono text-lg font-medium ${getTimeColor()}`}>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
        
        {percentage <= 25 && (
          <div className={`text-sm mt-2 ${getTimeColor()}`}>
            {percentage <= 10 ? "Time is running out!" : "Less than 25% time remaining"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamTimer;
