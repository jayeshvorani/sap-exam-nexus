
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Exam {
  id: string;
  title: string;
}

interface BulkAssignmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuestions: string[];
  exams: Exam[];
  onAssign: (questionIds: string[], examId: string) => Promise<boolean>;
}

const BulkAssignmentDialog = ({
  isOpen,
  onOpenChange,
  selectedQuestions,
  exams,
  onAssign
}: BulkAssignmentDialogProps) => {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedExam || selectedQuestions.length === 0) return;

    setIsAssigning(true);
    const success = await onAssign(selectedQuestions, selectedExam);
    
    if (success) {
      setSelectedExam("");
      onOpenChange(false);
    }
    
    setIsAssigning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Questions to Exam</DialogTitle>
          <DialogDescription>
            Assign {selectedQuestions.length} selected questions to an exam.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger>
              <SelectValue placeholder="Select an exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedExam || isAssigning}
          >
            {isAssigning ? "Assigning..." : "Assign Questions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAssignmentDialog;
