
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Search, BookOpen } from "lucide-react";
import { useExams } from "@/hooks/useExams";
import { useExamAssignments } from "@/hooks/useExamAssignments";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ExamBrowserProps {
  selectedUserId?: string;
  onExamAssigned?: () => void;
}

export const ExamBrowser = ({ selectedUserId, onExamAssigned }: ExamBrowserProps) => {
  const { exams, loading } = useExams();
  const { assignExamToUser, loading: assigning } = useExamAssignments();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [assignedExamIds, setAssignedExamIds] = useState<Set<string>>(new Set());

  const targetUserId = selectedUserId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchAssignedExams();
    }
  }, [targetUserId]);

  const fetchAssignedExams = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('user_exam_assignments')
        .select('exam_id')
        .eq('user_id', targetUserId)
        .eq('is_active', true);

      if (error) throw error;

      const assignedIds = new Set(data?.map(assignment => assignment.exam_id) || []);
      setAssignedExamIds(assignedIds);
    } catch (error) {
      console.error('Error fetching assigned exams:', error);
    }
  };

  const handleAssignExam = async (examId: string) => {
    if (!targetUserId) return;

    const success = await assignExamToUser(examId, targetUserId);
    if (success) {
      // Add the exam to the assigned set
      setAssignedExamIds(prev => new Set([...prev, examId]));
      
      if (onExamAssigned) {
        onExamAssigned();
      }
    }
  };

  // Filter out already assigned exams
  const availableExams = exams.filter(exam => !assignedExamIds.has(exam.id));

  const filteredExams = availableExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || exam.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || exam.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Use available exams for category and difficulty filters
  const categories = [...new Set(availableExams.map(exam => exam.category).filter(Boolean))];
  const difficulties = [...new Set(availableExams.map(exam => exam.difficulty).filter(Boolean))];

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category!}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty!}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exam Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {exam.icon_url && (
                    <img 
                      src={exam.icon_url} 
                      alt={exam.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {exam.category && (
                        <Badge variant="outline" className="text-xs">
                          {exam.category}
                        </Badge>
                      )}
                      {exam.difficulty && (
                        <Badge className={`text-xs ${getDifficultyColor(exam.difficulty)}`}>
                          {exam.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                {exam.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{exam.duration_minutes} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>{exam.total_questions} questions</span>
                </div>
                <div className="text-xs">
                  {exam.passing_percentage}% to pass
                </div>
              </div>
              
              <Button 
                onClick={() => handleAssignExam(exam.id)}
                disabled={assigning}
                className="w-full"
              >
                {assigning ? "Assigning..." : 
                 selectedUserId ? "Assign Exam" : "Self-Assign"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {assignedExamIds.size > 0 && availableExams.length === 0 
              ? "All exams have been assigned" 
              : "No exams found matching your criteria"}
          </p>
        </div>
      )}
    </div>
  );
};
