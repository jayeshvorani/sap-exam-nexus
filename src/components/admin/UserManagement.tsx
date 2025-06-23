
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Crown, UserCheck, UserX, Search, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserApprovalManagement from "./UserApprovalManagement";
import { UserActionDropdown } from "./user-management/UserActionDropdown";
import { UserStatusIndicator } from "./user-management/UserStatusIndicator";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  approval_status: string;
  email_verified: boolean;
  is_active: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching users for management...');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Users fetched:', data?.length || 0);
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    let isMounted = true;
    
    const loadUsers = async () => {
      if (isMounted) {
        await fetchUsers();
      }
    };
    
    loadUsers();
    
    return () => {
      isMounted = false;
    };
  }, [fetchUsers]);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Role updated",
        description: `User role has been changed to ${newRole}`,
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const deactivateUser = async (userId: string) => {
    if (!user) return;

    try {
      console.log('Deactivating user:', userId);
      const { error } = await supabase.rpc('deactivate_user', {
        target_user_id: userId,
        admin_id: user.id
      });

      if (error) {
        console.error('Error deactivating user:', error);
        throw error;
      }

      await fetchUsers();

      toast({
        title: "User deactivated",
        description: "User has been successfully deactivated",
      });
    } catch (error: any) {
      console.error('Error deactivating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };

  const reactivateUser = async (userId: string) => {
    if (!user) return;

    try {
      console.log('Reactivating user:', userId);
      const { error } = await supabase.rpc('reactivate_user', {
        target_user_id: userId,
        admin_id: user.id
      });

      if (error) {
        console.error('Error reactivating user:', error);
        throw error;
      }

      await fetchUsers();

      toast({
        title: "User reactivated",
        description: "User has been successfully reactivated",
      });
    } catch (error: any) {
      console.error('Error reactivating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reactivate user",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!user) return;

    try {
      console.log('Permanently deleting user:', userId);
      const { error } = await supabase.rpc('delete_user_permanently', {
        target_user_id: userId,
        admin_id: user.id
      });

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      await fetchUsers();

      toast({
        title: "User deleted",
        description: "User has been permanently deleted",
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (!user) return;

    // Filter out the logged-in user from selection
    const usersToDelete = selectedUsers.filter(userId => userId !== user.id);
    
    if (usersToDelete.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select users to delete (excluding yourself)",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete ${usersToDelete.length} users? This action cannot be undone.`)) return;

    try {
      setLoading(true);
      
      // Delete users one by one using the RPC function
      for (const userId of usersToDelete) {
        const { error } = await supabase.rpc('delete_user_permanently', {
          target_user_id: userId,
          admin_id: user.id
        });

        if (error) {
          console.error(`Error deleting user ${userId}:`, error);
          throw error;
        }
      }

      toast({
        title: "Success",
        description: `Successfully deleted ${usersToDelete.length} users`,
      });
      
      setSelectedUsers([]);
      await fetchUsers();
    } catch (error: any) {
      console.error('Error deleting users:', error);
      toast({
        title: "Error",
        description: `Failed to delete users: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all users except current user and admins
      const selectableUsers = filteredUsers.filter(u => 
        u.id !== user?.id && 
        u.role !== 'admin' && 
        u.approval_status === 'approved'
      );
      setSelectedUsers(selectableUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && user.is_active && user.approval_status === 'approved') ||
                         (statusFilter === "inactive" && !user.is_active) ||
                         (statusFilter === "pending" && user.approval_status === 'pending') ||
                         (statusFilter === "rejected" && user.approval_status === 'rejected');
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate selectable users (excluding current user and admins)
  const selectableUsers = filteredUsers.filter(u => 
    u.id !== user?.id && 
    u.role !== 'admin' && 
    u.approval_status === 'approved'
  );

  const isAllSelected = selectedUsers.length === selectableUsers.length && selectableUsers.length > 0;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < selectableUsers.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <p className="gradient-text font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="approvals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50">
          <TabsTrigger value="approvals" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">User Approvals</TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="approvals">
          <UserApprovalManagement />
        </TabsContent>
        
        <TabsContent value="management">
          <Card className="gradient-card border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 gradient-text">
                <div className="w-6 h-6 gradient-bg rounded-md flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, assign roles, and control access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="search" className="text-foreground font-medium">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-primary/30 hover:border-primary/50 focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="roleFilter" className="text-foreground font-medium">Filter by Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-32 border-primary/30 hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="candidate">Candidate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="statusFilter" className="text-foreground font-medium">Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 border-primary/30 hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Deactivated</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Selection Controls */}
              {selectableUsers.length > 0 && (
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/50 mb-6">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      style={{
                        backgroundColor: isIndeterminate ? 'hsl(var(--primary))' : undefined,
                        borderColor: isIndeterminate ? 'hsl(var(--primary))' : undefined,
                      }}
                    />
                    <span className="text-sm font-medium">
                      {selectedUsers.length === 0 
                        ? `Select all users (${selectableUsers.length} selectable)`
                        : `${selectedUsers.length} of ${selectableUsers.length} users selected`
                      }
                    </span>
                  </div>

                  {selectedUsers.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleBulkDelete}
                      className="border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                      Delete Selected
                      <span className="ml-2 bg-destructive/20 text-destructive px-2 py-0.5 rounded-full text-xs font-medium">
                        {selectedUsers.length}
                      </span>
                    </Button>
                  )}
                </div>
              )}

              {/* Users Table */}
              <div className="border rounded-lg border-primary/20 overflow-hidden shadow-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-primary/20">
                      <TableHead className="text-foreground font-semibold w-12">Select</TableHead>
                      <TableHead className="text-foreground font-semibold">User</TableHead>
                      <TableHead className="text-foreground font-semibold">Email</TableHead>
                      <TableHead className="text-foreground font-semibold">Role</TableHead>
                      <TableHead className="text-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-foreground font-semibold">Joined</TableHead>
                      <TableHead className="text-foreground font-semibold">Role Actions</TableHead>
                      <TableHead className="text-foreground font-semibold">User Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((userProfile) => {
                      const isCurrentUser = userProfile.id === user?.id;
                      const isSelectable = !isCurrentUser && userProfile.role !== 'admin' && userProfile.approval_status === 'approved';

                      return (
                        <TableRow 
                          key={userProfile.id} 
                          className={`border-primary/10 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-300 ${
                            selectedUsers.includes(userProfile.id) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <TableCell>
                            {isSelectable ? (
                              <Checkbox
                                checked={selectedUsers.includes(userProfile.id)}
                                onCheckedChange={(checked) => handleSelectUser(userProfile.id, !!checked)}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            ) : (
                              <div className="w-4 h-4" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium text-foreground flex items-center gap-2">
                                  {userProfile.full_name}
                                  {isCurrentUser && (
                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">@{userProfile.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">{userProfile.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {userProfile.role === 'admin' ? (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              ) : (
                                <UserCheck className="w-4 h-4 text-blue-500" />
                              )}
                              <span className={`capitalize px-3 py-1 rounded-full text-xs font-semibold border ${
                                userProfile.role === 'admin' 
                                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300/50 dark:border-yellow-700/50' 
                                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 border-blue-300/50 dark:border-blue-700/50'
                              }`}>
                                {userProfile.role}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <UserStatusIndicator 
                              emailVerified={userProfile.email_verified} 
                              approvalStatus={userProfile.approval_status}
                              isActive={userProfile.is_active}
                            />
                          </TableCell>
                          <TableCell className="text-foreground">
                            {new Date(userProfile.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {userProfile.approval_status === 'approved' && userProfile.is_active && (
                              <Select
                                value={userProfile.role}
                                onValueChange={(newRole) => updateUserRole(userProfile.id, newRole)}
                              >
                                <SelectTrigger className="w-32 border-primary/30 hover:border-primary/50 transition-colors">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                                  <SelectItem value="candidate">Candidate</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            <UserActionDropdown
                              user={userProfile}
                              onDeactivate={deactivateUser}
                              onReactivate={reactivateUser}
                              onDelete={deleteUser}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <UserX className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-muted-foreground">No users found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
