
import { Button } from "@/components/ui/button";

interface ExamErrorProps {
  title: string;
  message: string;
  onBackToDashboard: () => void;
}

const ExamError = ({ title, message, onBackToDashboard }: ExamErrorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
      <div className="text-center max-w-md glass p-8 rounded-lg shadow-elegant border-border/50 animate-scale-in">
        <h1 className="text-2xl font-semibold mb-4 text-gradient">{title}</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Button onClick={onBackToDashboard} className="gradient-primary text-white shadow-elegant hover:shadow-lg transition-all duration-300">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ExamError;
