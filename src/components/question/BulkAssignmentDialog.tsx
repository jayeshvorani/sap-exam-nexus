
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users } from "lucide-react";

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

  const handleClose = () => {
    setSelectedExam("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Bulk Assign Questions
          </DialogTitle>
          <DialogDescription>
            Assign the selected questions to an exam. This will add them to the exam's question pool.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Questions selected:
            </span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {selectedQuestions.length}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Target Exam</label>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an exam to assign questions to" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {exam.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedExam && (
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                Ready to assign {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} to the selected exam.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isAssigning}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedExam || isAssigning}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isAssigning ? "Assigning..." : `Assign ${selectedQuestions.length} Question${selectedQuestions.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAssignmentDialog;
