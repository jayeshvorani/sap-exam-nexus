
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useExamAssignments } from "@/hooks/useExamAssignments";

interface UserExamAssignment {
  id: string;
  user_id: string;
  exam_id: string;
  assigned_at: string;
  assigned_by: string | null;
  user_profiles: {
    full_name: string;
    username: string;
    email: string;
  };
  exams: {
    title: string;
    category: string | null;
    difficulty: string | null;
    duration_minutes: number;
    total_questions: number;
  };
}

export const UserAssignedExams = () => {
  const [assignments, setAssignments] = useState<UserExamAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { removeExamAssignment, loading: removing } = useExamAssignments();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_exam_assignments')
        .select(`
          *,
          user_profiles!inner(full_name, username, email),
          exams!inner(title, category, difficulty, duration_minutes, total_questions)
        `)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load exam assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (userId: string, examId: string) => {
    const success = await removeExamAssignment(userId, examId);
    if (success) {
      fetchAssignments(); // Refresh the list
    }
  };

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
          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Manage Exam Assignments
        </CardTitle>
        <CardDescription>
          View and manage all active exam assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No exam assignments found</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assignment.user_profiles.full_name}</div>
                        <div className="text-sm text-gray-500">@{assignment.user_profiles.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{assignment.exams.title}</div>
                      <div className="text-sm text-gray-500">
                        {assignment.exams.total_questions} questions
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.exams.category && (
                        <Badge variant="outline">
                          {assignment.exams.category}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.exams.difficulty && (
                        <Badge className={getDifficultyColor(assignment.exams.difficulty)}>
                          {assignment.exams.difficulty}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.exams.duration_minutes} min
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveAssignment(assignment.user_id, assignment.exam_id)}
                        disabled={removing}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
