
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

      <Button
        variant="outline"
        onClick={onBulkAssign}
        disabled={selectedQuestions.length === 0}
        className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-800 dark:text-blue-300"
      >
        <Users className="w-4 h-4 mr-2" />
        Assign to Exam ({selectedQuestions.length})
      </Button>

      {selectedQuestions.length > 0 && (
        <div className="text-sm text-muted-foreground flex items-center">
          <Search className="w-4 h-4 mr-1" />
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
