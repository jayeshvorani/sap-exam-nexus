
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ImageUpload from "./form/ImageUpload";
import OptionsManager from "./form/OptionsManager";
import ExamSelector from "./form/ExamSelector";
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

  // Determine question type based on number of correct answers
  const getQuestionType = () => {
    return formData.correct_answers.length > 1 ? "multiple_choice" : "single_choice";
  };

  const handleSubmitWithTypeDetection = (e: React.FormEvent) => {
    e.preventDefault();
    // Update question type based on correct answers before submitting
    const updatedFormData = {
      ...formData,
      question_type: getQuestionType()
    };
    setFormData(updatedFormData);
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmitWithTypeDetection} className="space-y-4">
      <ExamSelector
        exams={exams}
        selectedExamIds={formData.exam_ids}
        onSelectionChange={(examIds) => setFormData({...formData, exam_ids: examIds})}
      />

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
            correct_answers: newCorrectAnswers.sort(),
            question_type: newCorrectAnswers.length > 1 ? "multiple_choice" : "single_choice"
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

        <div>
          <Label htmlFor="question_type_display">Question Type</Label>
          <Input
            id="question_type_display"
            value={getQuestionType() === "multiple_choice" ? "Multiple Choice" : "Single Choice"}
            readOnly
            className="bg-gray-50 dark:bg-gray-800"
          />
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
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Add Question')}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
