
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload } from "lucide-react";
import QuestionForm from "./QuestionForm";

interface Exam {
  id: string;
  title: string;
}

interface QuestionActionsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  editingQuestion: any;
  setEditingQuestion: (question: any) => void;
  exams: Exam[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  resetForm: () => void;
}

const QuestionActions = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  editingQuestion,
  setEditingQuestion,
  exams,
  onFileUpload,
  onSubmit,
  formData,
  setFormData,
  resetForm
}: QuestionActionsProps) => {
  return (
    <div className="flex gap-4">
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) {
          setEditingQuestion(null);
          resetForm();
        }
      }}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            <DialogDescription>
              {editingQuestion ? 'Update the question details below' : 'Fill in the details to create a new question'}
            </DialogDescription>
          </DialogHeader>
          
          <QuestionForm
            onSubmit={onSubmit}
            formData={formData}
            setFormData={setFormData}
            exams={exams}
            editingQuestion={editingQuestion}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onFileUpload}
          className="hidden"
          id="file-upload"
        />
        <Button variant="outline" asChild>
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Label>
        </Button>
      </div>
    </div>
  );
};

export default QuestionActions;
