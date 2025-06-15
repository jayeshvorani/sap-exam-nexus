
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileText } from "lucide-react";
import { useEffect, useRef } from "react";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answers: any;
  difficulty: string;
  explanation?: string;
  image_url?: string;
  exams?: { title: string }[];
}

interface Exam {
  id: string;
  title: string;
}

interface QuestionTableProps {
  questions: Question[];
  exams: Exam[];
  loading: boolean;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
  selectedQuestions: string[];
  onSelectionChange: (questionIds: string[]) => void;
}

const getDifficultyVariant = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'hard':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'multiple_choice':
      return '●';
    case 'true_false':
      return '✓';
    case 'short_answer':
      return '✎';
    default:
      return '?';
  }
};

const QuestionTable = ({
  questions,
  exams,
  loading,
  onEdit,
  onDelete,
  selectedQuestions,
  onSelectionChange
}: QuestionTableProps) => {
  const selectAllRef = useRef<HTMLButtonElement>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(questions.map(q => q.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectQuestion = (questionId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedQuestions, questionId]);
    } else {
      onSelectionChange(selectedQuestions.filter(id => id !== questionId));
    }
  };

  const allSelected = questions.length > 0 && selectedQuestions.length === questions.length;
  const someSelected = selectedQuestions.length > 0 && selectedQuestions.length < questions.length;

  // Handle indeterminate state for select all checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      const checkboxElement = selectAllRef.current.querySelector('[role="checkbox"]') as HTMLElement;
      if (checkboxElement) {
        checkboxElement.setAttribute('data-state', someSelected ? 'indeterminate' : (allSelected ? 'checked' : 'unchecked'));
      }
    }
  }, [allSelected, someSelected]);

  if (loading) {
    return (
      <Card className="shadow-elegant">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            <div className="text-muted-foreground">Loading questions...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="shadow-elegant">
        <CardHeader className="text-center pb-4">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
          <CardTitle className="text-xl">No Questions Found</CardTitle>
          <CardDescription>
            No questions match your current filters. Try adjusting your search or exam selection.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant border-0">
      <CardHeader className="border-b bg-muted/20 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Questions Library
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({questions.length} {questions.length === 1 ? 'question' : 'questions'})
              </span>
            </CardTitle>
            <CardDescription className="mt-1">
              Manage and organize your exam questions
              {selectedQuestions.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  {selectedQuestions.length} selected
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-12 py-4">
                  <Checkbox
                    ref={selectAllRef}
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    className="ml-1"
                  />
                </TableHead>
                <TableHead className="font-semibold text-foreground">Question</TableHead>
                <TableHead className="font-semibold text-foreground">Assigned Exams</TableHead>
                <TableHead className="font-semibold text-foreground w-32">Type</TableHead>
                <TableHead className="font-semibold text-foreground w-28">Difficulty</TableHead>
                <TableHead className="font-semibold text-foreground w-20 text-center">Options</TableHead>
                <TableHead className="font-semibold text-foreground w-24 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question, index) => (
                <TableRow 
                  key={question.id} 
                  className={`
                    border-b transition-all duration-200 hover:bg-muted/30 
                    ${selectedQuestions.includes(question.id) ? 'bg-muted/20' : ''}
                    ${index % 2 === 0 ? 'bg-background' : 'bg-muted/5'}
                  `}
                >
                  <TableCell className="py-4">
                    <Checkbox
                      checked={selectedQuestions.includes(question.id)}
                      onCheckedChange={(checked) => handleSelectQuestion(question.id, checked === true)}
                      className="ml-1"
                    />
                  </TableCell>
                  
                  <TableCell className="py-4 max-w-md">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-2">
                        {question.question_text}
                      </p>
                      {question.explanation && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {question.exams && question.exams.length > 0 ? (
                        question.exams.map((exam, index) => (
                          <Badge 
                            key={index}
                            variant="outline"
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            {exam.title}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="text-xs px-2 py-1 text-muted-foreground">
                          Unassigned
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-muted-foreground">
                        {getTypeIcon(question.question_type)}
                      </span>
                      <span className="text-sm capitalize text-foreground">
                        {question.question_type.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <Badge 
                      variant={getDifficultyVariant(question.difficulty)}
                      className="text-xs px-3 py-1 font-medium"
                    >
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-4 text-center">
                    <span className="text-sm text-muted-foreground font-mono">
                      {Array.isArray(question.options) ? question.options.length : 0}
                    </span>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(question)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(question.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionTable;
