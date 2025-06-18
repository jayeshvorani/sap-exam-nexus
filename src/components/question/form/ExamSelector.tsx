
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Exam {
  id: string;
  title: string;
}

interface ExamSelectorProps {
  exams: Exam[];
  selectedExamIds: string[];
  onSelectionChange: (examIds: string[]) => void;
}

const ExamSelector = ({ exams, selectedExamIds, onSelectionChange }: ExamSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedExams = exams.filter(exam => selectedExamIds.includes(exam.id));

  const handleSelect = (examId: string) => {
    console.log('ExamSelector - handleSelect called with examId:', examId);
    const isSelected = selectedExamIds.includes(examId);
    if (isSelected) {
      onSelectionChange(selectedExamIds.filter(id => id !== examId));
    } else {
      onSelectionChange([...selectedExamIds, examId]);
    }
  };

  const removeExam = (examId: string) => {
    onSelectionChange(selectedExamIds.filter(id => id !== examId));
  };

  // Filter exams based on search
  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label>Assign to Exams *</Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedExams.length === 0 
              ? "Select exams..." 
              : `${selectedExams.length} exam${selectedExams.length !== 1 ? 's' : ''} selected`
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search exams..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filteredExams.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No exams found.
              </div>
            ) : (
              filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSelect(exam.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedExamIds.includes(exam.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {exam.title}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedExams.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedExams.map((exam) => (
            <Badge key={exam.id} variant="secondary" className="text-xs">
              {exam.title}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => removeExam(exam.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamSelector;
