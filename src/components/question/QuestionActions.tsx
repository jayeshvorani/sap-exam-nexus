
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload } from "lucide-react";

interface QuestionActionsProps {
  onAddQuestion: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const QuestionActions = ({
  onAddQuestion,
  onFileUpload
}: QuestionActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onAddQuestion}>
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </Button>

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
