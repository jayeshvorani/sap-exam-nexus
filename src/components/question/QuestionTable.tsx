
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";

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

const QuestionTable = ({
  questions,
  exams,
  loading,
  onEdit,
  onDelete,
  selectedQuestions,
  onSelectionChange
}: QuestionTableProps) => {
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

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">Loading questions...</div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Questions (0)</CardTitle>
          <CardDescription>
            Manage all questions across your exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No questions found. Add some questions to get started.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions ({questions.length})</CardTitle>
        <CardDescription>
          Manage all questions across your exams
          {selectedQuestions.length > 0 && (
            <span className="ml-2 text-primary font-medium">
              • {selectedQuestions.length} selected
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Exams</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Options</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedQuestions.includes(question.id)}
                    onCheckedChange={(checked) => handleSelectQuestion(question.id, checked === true)}
                  />
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate">{question.question_text}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {question.exams && question.exams.length > 0 ? (
                      question.exams.map((exam, index) => (
                        <span 
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {exam.title}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No exams assigned</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{question.question_type}</TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty}
                  </span>
                </TableCell>
                <TableCell>
                  {Array.isArray(question.options) ? question.options.length : 0}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(question)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default QuestionTable;
