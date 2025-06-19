
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, Search } from "lucide-react";
import ImportDialog from "./ImportDialog";

interface QuestionActionsProps {
  onAddQuestion: () => void;
  selectedExamId: string;
  onImport: (questions: any[]) => Promise<boolean>;
  onRefresh?: () => void;
  selectedQuestions: string[];
  onBulkAssign: () => void;
}

const QuestionActions = ({
  onAddQuestion,
  selectedExamId,
  onImport,
  onRefresh,
  selectedQuestions,
  onBulkAssign
}: QuestionActionsProps) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  return (
    <div className="flex gap-4 flex-wrap">
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
        onClick={onBulkAssign}
        disabled={selectedQuestions.length === 0}
        className="border-success/30 hover:bg-success/10 hover:border-success/50 transition-all duration-300"
      >
        <Users className="w-4 h-4 mr-2 text-success" />
        Assign to Exam ({selectedQuestions.length})
      </Button>

      {selectedQuestions.length > 0 && (
        <div className="text-sm text-muted-foreground flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 mr-1 text-blue-500" />
          {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
        </div>
      )}

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
