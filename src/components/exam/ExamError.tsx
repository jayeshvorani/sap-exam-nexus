
import { Button } from "@/components/ui/button";

interface ExamErrorProps {
  title: string;
  message: string;
  onBackToDashboard: () => void;
}

const ExamError = ({ title, message, onBackToDashboard }: ExamErrorProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={onBackToDashboard}>Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default ExamError;
