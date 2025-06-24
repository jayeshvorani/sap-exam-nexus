
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import ImportDialog from "./ImportDialog";

interface QuestionActionsProps {
  onAddQuestion: () => void;
  selectedExamId: string;
  onImport: (questions: any[]) => Promise<boolean>;
  onRefresh?: () => void;
  selectedQuestions: string[];
  onBulkAssign: () => void;
  onBulkDelete: () => void;
}

const QuestionActions = ({
  onAddQuestion,
  selectedExamId,
  onImport,
  onRefresh,
  selectedQuestions,
  onBulkAssign,
  onBulkDelete
}: QuestionActionsProps) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Button onClick={onAddQuestion} className="gradient-button text-white hover:opacity-90 transition-all duration-300 shadow-lg">
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </Button>

      <Button 
        variant="outline" 
        onClick={() => setIsImportDialogOpen(true)}
        disabled={!selectedExamId || selectedExamId === "all"}
        className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
      >
        Import CSV
      </Button>

      <Button
        variant="outline"
        onClick={onBulkDelete}
        disabled={selectedQuestions.length === 0}
        className="border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-4 h-4 mr-2 text-destructive" />
        Delete Selected
        {selectedQuestions.length > 0 && (
          <span className="ml-2 bg-destructive/20 text-destructive px-2 py-0.5 rounded-full text-xs font-medium">
            {selectedQuestions.length}
          </span>
        )}
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
