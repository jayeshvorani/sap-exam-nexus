
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ExamBrowser } from "@/components/exam/ExamBrowser";
import { UserAssignedExams } from "./UserAssignedExams";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Users } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  approval_status: string;
}

export const ExamAssignmentManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('approval_status', 'approved')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExamAssigned = () => {
    // Refresh assigned exams or show success message
    toast({
      title: "Success",
      description: "Exam assigned successfully",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <BookOpen className="w-8 h-8 text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <p className="text-slate-700 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="assign" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <TabsTrigger 
            value="assign"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 text-slate-700 dark:text-slate-300"
          >
            Assign Exams
          </TabsTrigger>
          <TabsTrigger 
            value="manage"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 text-slate-700 dark:text-slate-300"
          >
            Manage Assignments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assign">
          <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Assign Exams to Users
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Select a user and assign exams to them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="userSelect" className="text-slate-900 dark:text-slate-100 font-medium">Select User</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                    <SelectValue placeholder="Choose a user to assign exams to" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 z-50">
                    {users.map((user) => (
                      <SelectItem 
                        key={user.id} 
                        value={user.id}
                        className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700 data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-700"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <span className="font-medium">{user.full_name}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">(@{user.username})</span>
                          <span className={`text-xs px-2 py-1 rounded-full ml-auto ${
                            user.role === 'admin' 
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' 
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUserId && (
                <ExamBrowser 
                  selectedUserId={selectedUserId} 
                  onExamAssigned={handleExamAssigned}
                />
              )}

              {!selectedUserId && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Select a user to start assigning exams</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <UserAssignedExams />
        </TabsContent>
      </Tabs>
    </div>
  );
};
