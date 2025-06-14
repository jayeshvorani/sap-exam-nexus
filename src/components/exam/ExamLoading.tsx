
interface ExamLoadingProps {
  message: string;
}

const ExamLoading = ({ message }: ExamLoadingProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
      <div className="text-center glass p-8 rounded-lg shadow-elegant border-border/50 animate-scale-in">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default ExamLoading;
