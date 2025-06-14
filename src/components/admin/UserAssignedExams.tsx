
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
  user_profile: {
    full_name: string;
    username: string;
    email: string;
  } | null;
  exam: {
    title: string;
    category: string | null;
    difficulty: string | null;
    duration_minutes: number;
    total_questions: number;
  } | null;
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
      
      // First get the assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('user_exam_assignments')
        .select('*')
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });

      if (assignmentsError) throw assignmentsError;

      if (!assignmentsData || assignmentsData.length === 0) {
        setAssignments([]);
        return;
      }

      // Get unique user IDs and exam IDs
      const userIds = [...new Set(assignmentsData.map(a => a.user_id))];
      const examIds = [...new Set(assignmentsData.map(a => a.exam_id))];

      // Fetch user profiles
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, full_name, username, email')
        .in('id', userIds);

      if (usersError) throw usersError;

      // Fetch exams
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select('id, title, category, difficulty, duration_minutes, total_questions')
        .in('id', examIds);

      if (examsError) throw examsError;

      // Combine the data
      const combinedData = assignmentsData.map(assignment => ({
        ...assignment,
        user_profile: usersData?.find(u => u.id === assignment.user_id) || null,
        exam: examsData?.find(e => e.id === assignment.exam_id) || null
      }));

      setAssignments(combinedData);
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
                        <div className="font-medium">
                          {assignment.user_profile?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{assignment.user_profile?.username || 'unknown'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {assignment.exam?.title || 'Unknown Exam'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {assignment.exam?.total_questions || 0} questions
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.exam?.category && (
                        <Badge variant="outline">
                          {assignment.exam.category}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.exam?.difficulty && (
                        <Badge className={getDifficultyColor(assignment.exam.difficulty)}>
                          {assignment.exam.difficulty}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.exam?.duration_minutes || 0} min
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
