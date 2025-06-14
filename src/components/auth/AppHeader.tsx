
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

interface AppHeaderProps {
  onBack: () => void;
  showBackButton?: boolean;
}

const AppHeader = ({ onBack, showBackButton = true }: AppHeaderProps) => {
  return (
    <div className="text-center mb-8">
      {showBackButton && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute top-4 left-4 border-border/50 hover:bg-accent/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}
      
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-elegant">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gradient">Prep Vault</h1>
      </div>
    </div>
  );
};

export default AppHeader;
