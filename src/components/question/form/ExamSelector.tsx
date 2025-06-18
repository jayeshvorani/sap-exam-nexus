
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      <Label>Assign to Exams *</Label>
      
      <div className="relative" ref={dropdownRef}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="w-full justify-between"
        >
          {selectedExams.length === 0 
            ? "Select exams..." 
            : `${selectedExams.length} exam${selectedExams.length !== 1 ? 's' : ''} selected`
          }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Search exams..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                onClick={(e) => e.stopPropagation()}
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
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(exam.id);
                    }}
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
          </div>
        )}
      </div>

      {selectedExams.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedExams.map((exam) => (
            <Badge key={exam.id} variant="secondary" className="text-xs">
              {exam.title}
              <Button
                type="button"
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
