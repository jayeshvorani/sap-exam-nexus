
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_percentage: number;
  is_active: boolean;
  category: string | null;
  difficulty: string | null;
  icon_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ExamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  editingExam: Exam | null;
}

export const ExamForm = ({ isOpen, onClose, onSubmit, editingExam }: ExamFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
    total_questions: 50,
    passing_percentage: 70,
    is_active: true,
    category: "",
    difficulty: "intermediate",
    icon_url: "",
    image_url: ""
  });

  // Update form data when editingExam changes
  useEffect(() => {
    if (editingExam) {
      setFormData({
        title: editingExam.title || "",
        description: editingExam.description || "",
        duration_minutes: editingExam.duration_minutes || 60,
        total_questions: editingExam.total_questions || 50,
        passing_percentage: editingExam.passing_percentage || 70,
        is_active: editingExam.is_active ?? true,
        category: editingExam.category || "",
        difficulty: editingExam.difficulty || "intermediate",
        icon_url: editingExam.icon_url || "",
        image_url: editingExam.image_url || ""
      });
    } else {
      // Reset to default values when adding new exam
      resetForm();
    }
  }, [editingExam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration_minutes: 60,
      total_questions: 50,
      passing_percentage: 70,
      is_active: true,
      category: "",
      difficulty: "intermediate",
      icon_url: "",
      image_url: ""
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingExam ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
          <DialogDescription>
            {editingExam ? 'Update the exam details below.' : 'Fill in the details to create a new exam.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Fundamentals, Database, Finance"
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="icon_url">Icon URL</Label>
              <Input
                id="icon_url"
                value={formData.icon_url}
                onChange={(e) => setFormData({...formData, icon_url: e.target.value})}
                placeholder="https://example.com/icon.png"
              />
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value) || 60})}
                required
              />
            </div>

            <div>
              <Label htmlFor="total_questions">Total Questions *</Label>
              <Input
                id="total_questions"
                type="number"
                min="1"
                value={formData.total_questions}
                onChange={(e) => setFormData({...formData, total_questions: parseInt(e.target.value) || 50})}
                required
              />
            </div>

            <div>
              <Label htmlFor="passing_percentage">Passing Percentage (%) *</Label>
              <Input
                id="passing_percentage"
                type="number"
                min="1"
                max="100"
                value={formData.passing_percentage}
                onChange={(e) => setFormData({...formData, passing_percentage: parseInt(e.target.value) || 70})}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingExam ? 'Update Exam' : 'Create Exam'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
