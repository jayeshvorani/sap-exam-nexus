
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, X } from "lucide-react";
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

  const selectedExams = exams.filter(exam => selectedExamIds.includes(exam.id));

  const handleSelect = (examId: string) => {
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
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-w-[400px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search exams..." 
              className="h-9" 
            />
            <CommandList className="max-h-[200px] overflow-y-auto">
              <CommandEmpty>No exams found.</CommandEmpty>
              <CommandGroup>
                {exams.map((exam) => (
                  <CommandItem
                    key={exam.id}
                    value={exam.title}
                    onSelect={() => handleSelect(exam.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedExamIds.includes(exam.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {exam.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
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
