
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface Exam {
  id: string;
  title: string;
}

interface QuestionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedExam: string;
  setSelectedExam: (value: string) => void;
  exams: Exam[];
  onExamChange: () => void;
}

const QuestionFilters = ({
  searchTerm,
  setSearchTerm,
  selectedExam,
  setSelectedExam,
  exams,
  onExamChange
}: QuestionFiltersProps) => {
  const handleExamChange = (value: string) => {
    setSelectedExam(value);
    setTimeout(onExamChange, 100);
  };

  return (
    <div className="flex gap-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
        <Input
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-primary/30 hover:border-primary/50 focus:border-primary transition-all duration-300"
        />
      </div>

      <Select value={selectedExam} onValueChange={handleExamChange}>
        <SelectTrigger className="w-48 border-primary/30 hover:border-primary/50 transition-all duration-300">
          <SelectValue placeholder="Filter by exam" />
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
          <SelectItem value="all">All Exams</SelectItem>
          {exams.map((exam) => (
            <SelectItem key={exam.id} value={exam.id}>
              {exam.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuestionFilters;
