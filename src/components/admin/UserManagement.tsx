
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
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("approvals");
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

  const bulkDeleteUsers = async () => {
    if (!user || selectedUsers.size === 0) return;

    try {
      const userIds = Array.from(selectedUsers);
      console.log('Bulk deleting users:', userIds);
      
      const promises = userIds.map(userId => 
        supabase.rpc('delete_user_permanently', {
          target_user_id: userId,
          admin_id: user.id
        })
      );

      const results = await Promise.allSettled(promises);
      const failures = results.filter(result => result.status === 'rejected').length;

      if (failures > 0) {
        toast({
          title: "Partial Success",
          description: `${userIds.length - failures} users deleted, ${failures} failed`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `${userIds.length} users deleted successfully`,
        });
      }

      setSelectedUsers(new Set());
      await fetchUsers();
    } catch (error: any) {
      console.error('Error bulk deleting users:', error);
      toast({
        title: "Error",
        description: "Failed to delete users",
        variant: "destructive",
      });
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(user => user.id)));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <User className="w-5 h-5 text-white" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-1">
          <TabsTrigger 
            value="approvals" 
            className="text-slate-700 dark:text-slate-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md font-semibold transition-all duration-200 rounded-md"
          >
            User Approvals
          </TabsTrigger>
          <TabsTrigger 
            value="management" 
            className="text-slate-700 dark:text-slate-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md font-semibold transition-all duration-200 rounded-md"
          >
            User Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="approvals">
          <UserApprovalManagement />
        </TabsContent>
        
        <TabsContent value="management">
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <User className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Manage user accounts, assign roles, and control access
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white dark:bg-slate-900">
              {/* Filters and Bulk Actions */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="search" className="text-slate-900 dark:text-slate-100 font-medium">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="roleFilter" className="text-slate-900 dark:text-slate-100 font-medium">Filter by Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-32 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      <SelectItem value="all" className="text-slate-900 dark:text-slate-100">All Roles</SelectItem>
                      <SelectItem value="admin" className="text-slate-900 dark:text-slate-100">Admin</SelectItem>
                      <SelectItem value="candidate" className="text-slate-900 dark:text-slate-100">Candidate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="statusFilter" className="text-slate-900 dark:text-slate-100 font-medium">Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      <SelectItem value="all" className="text-slate-900 dark:text-slate-100">All Status</SelectItem>
                      <SelectItem value="active" className="text-slate-900 dark:text-slate-100">Active</SelectItem>
                      <SelectItem value="inactive" className="text-slate-900 dark:text-slate-100">Deactivated</SelectItem>
                      <SelectItem value="pending" className="text-slate-900 dark:text-slate-100">Pending</SelectItem>
                      <SelectItem value="rejected" className="text-slate-900 dark:text-slate-100">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.size > 0 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800 dark:text-blue-200">
                      {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={bulkDeleteUsers}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div className="border rounded-lg border-slate-200 dark:border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">User</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Email</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Role</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Status</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Joined</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Role Actions</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">User Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((userProfile) => (
                      <TableRow key={userProfile.id} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.has(userProfile.id)}
                            onCheckedChange={() => toggleUserSelection(userProfile.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">{userProfile.full_name}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">@{userProfile.username}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-900 dark:text-slate-100">{userProfile.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {userProfile.role === 'admin' ? (
                              <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                            <span className={`capitalize px-3 py-1 rounded-full text-xs font-semibold border ${
                              userProfile.role === 'admin' 
                                ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700' 
                                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
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
                        <TableCell className="text-slate-900 dark:text-slate-100">
                          {new Date(userProfile.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {userProfile.approval_status === 'approved' && userProfile.is_active && (
                            <Select
                              value={userProfile.role}
                              onValueChange={(newRole) => updateUserRole(userProfile.id, newRole)}
                            >
                              <SelectTrigger className="w-32 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                                <SelectItem value="candidate" className="text-slate-900 dark:text-slate-100">Candidate</SelectItem>
                                <SelectItem value="admin" className="text-slate-900 dark:text-slate-100">Admin</SelectItem>
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
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <UserX className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No users found matching your criteria</p>
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
