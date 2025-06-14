
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "./form/ImageUpload";
import OptionsManager from "./form/OptionsManager";
import { useQuestionForm } from "@/hooks/useQuestionForm";

interface Exam {
  id: string;
  title: string;
}

interface QuestionFormProps {
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    question_text: string;
    question_type: string;
    options: string[];
    correct_answers: number[];
    difficulty: string;
    explanation: string;
    exam_ids: string[];
    image_url?: string;
  };
  setFormData: (data: any) => void;
  exams: Exam[];
  editingQuestion: any;
  onCancel: () => void;
  loading?: boolean;
}

const QuestionForm = ({
  onSubmit,
  formData,
  setFormData,
  exams,
  editingQuestion,
  onCancel,
  loading = false
}: QuestionFormProps) => {
  console.log('QuestionForm rendered with exams:', exams);
  console.log('Current form data:', formData);

  const { handleOptionChange, handleCorrectAnswerChange } = useQuestionForm(editingQuestion);

  const handleExamSelection = (examId: string, checked: boolean) => {
    const newExamIds = checked 
      ? [...formData.exam_ids, examId]
      : formData.exam_ids.filter(id => id !== examId);
    
    setFormData({...formData, exam_ids: newExamIds});
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="exams">Select Exams *</Label>
        <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
          {exams && exams.length > 0 ? (
            exams.map((exam) => (
              <div key={exam.id} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={exam.id}
                  checked={formData.exam_ids.includes(exam.id)}
                  onCheckedChange={(checked) => handleExamSelection(exam.id, checked as boolean)}
                />
                <Label htmlFor={exam.id} className="text-sm cursor-pointer">
                  {exam.title}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No exams available - Please create an exam first</p>
          )}
        </div>
        {(!exams || exams.length === 0) && (
          <p className="text-sm text-red-600 mt-1">
            No exams found. Please create an exam first before adding questions.
          </p>
        )}
        {formData.exam_ids.length === 0 && exams && exams.length > 0 && (
          <p className="text-sm text-red-600 mt-1">
            Please select at least one exam for this question.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="question_text">Question Text *</Label>
        <Textarea
          id="question_text"
          value={formData.question_text}
          onChange={(e) => setFormData({...formData, question_text: e.target.value})}
          placeholder="Enter the question..."
          required
          rows={3}
        />
      </div>

      <ImageUpload
        imageUrl={formData.image_url}
        onImageChange={(imageUrl) => setFormData({...formData, image_url: imageUrl})}
      />

      <OptionsManager
        options={formData.options}
        correctAnswers={formData.correct_answers}
        onOptionChange={(index, value) => {
          const newOptions = [...formData.options];
          newOptions[index] = value;
          setFormData({...formData, options: newOptions});
        }}
        onCorrectAnswerChange={(index, isCorrect) => {
          let newCorrectAnswers = [...formData.correct_answers];
          
          if (isCorrect) {
            if (!newCorrectAnswers.includes(index)) {
              newCorrectAnswers.push(index);
            }
          } else {
            newCorrectAnswers = newCorrectAnswers.filter(i => i !== index);
          }
          
          setFormData({
            ...formData,
            correct_answers: newCorrectAnswers.sort()
          });
        }}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="explanation">Explanation (Optional)</Label>
        <Textarea
          id="explanation"
          value={formData.explanation}
          onChange={(e) => setFormData({...formData, explanation: e.target.value})}
          placeholder="Explain why this is the correct answer..."
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={(!exams || exams.length === 0 || formData.exam_ids.length === 0) || loading}>
          {loading ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Add Question')}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
