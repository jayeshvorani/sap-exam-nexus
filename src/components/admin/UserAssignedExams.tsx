import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [selectedAssignments, setSelectedAssignments] = useState<Set<string>>(new Set());
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

  const bulkRemoveAssignments = async () => {
    if (selectedAssignments.size === 0) return;
    if (!confirm(`Are you sure you want to remove ${selectedAssignments.size} assignment(s)?`)) return;

    try {
      const assignmentIds = Array.from(selectedAssignments);
      const promises = assignmentIds.map(id => {
        const assignment = assignments.find(a => a.id === id);
        if (assignment) {
          return removeExamAssignment(assignment.user_id, assignment.exam_id);
        }
        return Promise.resolve(false);
      });

      const results = await Promise.all(promises);
      const successCount = results.filter(result => result).length;

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} assignment(s) removed successfully`,
        });
        setSelectedAssignments(new Set());
        fetchAssignments();
      }
    } catch (error: any) {
      console.error('Error bulk removing assignments:', error);
      toast({
        title: "Error",
        description: "Failed to remove assignments",
        variant: "destructive",
      });
    }
  };

  const toggleAssignmentSelection = (assignmentId: string) => {
    const newSelection = new Set(selectedAssignments);
    if (newSelection.has(assignmentId)) {
      newSelection.delete(assignmentId);
    } else {
      newSelection.add(assignmentId);
    }
    setSelectedAssignments(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedAssignments.size === assignments.length) {
      setSelectedAssignments(new Set());
    } else {
      setSelectedAssignments(new Set(assignments.map(assignment => assignment.id)));
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
    <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-blue-200 dark:border-indigo-700">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Users className="w-5 h-5 text-blue-600 dark:text-indigo-400" />
          Manage Exam Assignments
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          View and manage all active exam assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white dark:bg-slate-900 p-6">
        {assignments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No exam assignments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bulk Actions */}
            {selectedAssignments.size > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    {selectedAssignments.size} assignment{selectedAssignments.size !== 1 ? 's' : ''} selected
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={bulkRemoveAssignments}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                    disabled={removing}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Selected
                  </Button>
                </div>
              </div>
            )}

            <div className="border rounded-lg border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 border-slate-200 dark:border-slate-700">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedAssignments.size === assignments.length && assignments.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">User</TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Exam</TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Category</TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Difficulty</TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Duration</TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Assigned Date</TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <TableCell>
                        <Checkbox
                          checked={selectedAssignments.has(assignment.id)}
                          onCheckedChange={() => toggleAssignmentSelection(assignment.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {assignment.user_profile?.full_name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            @{assignment.user_profile?.username || 'unknown'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {assignment.exam?.title || 'Unknown Exam'}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {assignment.exam?.total_questions || 0} questions
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.exam?.category && (
                          <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
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
                      <TableCell className="text-slate-900 dark:text-slate-100">
                        {assignment.exam?.duration_minutes || 0} min
                      </TableCell>
                      <TableCell className="text-slate-900 dark:text-slate-100">
                        {new Date(assignment.assigned_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveAssignment(assignment.user_id, assignment.exam_id)}
                          disabled={removing}
                          className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
