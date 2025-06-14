
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useState } from "react";

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
    exam_id: string;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(formData.image_url || null);

  console.log('QuestionForm rendered with exams:', exams);
  console.log('Current form data:', formData);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData({...formData, image_url: result});
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({...formData, image_url: ""});
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({...formData, options: newOptions});
  };

  const handleCorrectAnswerChange = (index: number, isCorrect: boolean) => {
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
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="exam">Select Exam *</Label>
        <Select 
          value={formData.exam_id} 
          onValueChange={(value) => setFormData({...formData, exam_id: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose an exam" />
          </SelectTrigger>
          <SelectContent>
            {exams && exams.length > 0 ? (
              exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.title}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-exams" disabled>
                No exams available - Please create an exam first
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {(!exams || exams.length === 0) && (
          <p className="text-sm text-red-600 mt-1">
            No exams found. Please create an exam first before adding questions.
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

      <div>
        <Label>Question Image (Optional)</Label>
        <div className="mt-2">
          {imagePreview ? (
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Question preview" 
                className="max-w-xs max-h-48 rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload an image for this question</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button type="button" variant="outline" asChild>
                <Label htmlFor="image-upload" className="cursor-pointer">
                  Choose Image
                </Label>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label>Answer Options *</Label>
        <p className="text-sm text-gray-600 mb-2">
          Provide 2-5 answer options. You can leave some options empty if you need fewer than 5 choices.
        </p>
        {formData.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}${index < 2 ? ' (required)' : ' (optional)'}`}
              className={index < 2 ? "border-blue-300" : ""}
            />
            <input
              type="checkbox"
              checked={formData.correct_answers.includes(index)}
              onChange={(e) => handleCorrectAnswerChange(index, e.target.checked)}
              disabled={option.trim() === ""}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-500 min-w-[50px]">Correct</span>
          </div>
        ))}
        <p className="text-xs text-gray-500 mt-1">
          * At least 2 options are required. You can mark multiple options as correct.
        </p>
      </div>

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
        <Button type="submit" disabled={(!exams || exams.length === 0) || loading}>
          {loading ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Add Question')}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
