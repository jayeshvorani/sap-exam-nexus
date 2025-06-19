
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
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="assign" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
          <TabsTrigger 
            value="assign"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
          >
            Assign Exams
          </TabsTrigger>
          <TabsTrigger 
            value="manage"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
          >
            Manage Assignments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assign">
          <Card className="bg-card border-border shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <BookOpen className="w-5 h-5 text-primary" />
                Assign Exams to Users
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Select a user and assign exams to them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="userSelect" className="text-card-foreground font-medium">Select User</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Choose a user to assign exams to" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50 max-h-[300px] overflow-y-auto">
                    {users.map((user) => (
                      <SelectItem 
                        key={user.id} 
                        value={user.id}
                        className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <span className="font-medium text-popover-foreground">{user.full_name}</span>
                          <span className="text-sm text-muted-foreground">(@{user.username})</span>
                          <span className={`text-xs px-2 py-1 rounded-full ml-auto ${
                            user.role === 'admin' 
                              ? 'bg-warning/20 text-warning-foreground' 
                              : 'bg-info/20 text-info-foreground'
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
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a user to start assigning exams</p>
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
