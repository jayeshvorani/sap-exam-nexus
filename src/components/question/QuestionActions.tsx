
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ImportDialog from "./ImportDialog";

interface QuestionActionsProps {
  onAddQuestion: () => void;
  selectedExamId: string;
  onImport: (questions: any[]) => Promise<boolean>;
  onRefresh?: () => void;
}

const QuestionActions = ({
  onAddQuestion,
  selectedExamId,
  onImport,
  onRefresh
}: QuestionActionsProps) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <Button onClick={onAddQuestion}>
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </Button>

      <Button 
        variant="outline" 
        onClick={() => setIsImportDialogOpen(true)}
        disabled={!selectedExamId || selectedExamId === "all"}
      >
        Import CSV
      </Button>

      <ImportDialog
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        selectedExamId={selectedExamId}
        onImport={onImport}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default QuestionActions;
