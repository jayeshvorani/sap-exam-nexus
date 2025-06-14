import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, XCircle, Clock, Mail, Search, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PendingUser {
  id: string;
  username: string;
  full_name: string;
  email: string;
  approval_status: string;
  email_verified: boolean;
  created_at: string;
  rejected_reason?: string;
  role: string;
}

const UserApprovalManagement = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionDialog, setRejectionDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setRefreshing(true);
      console.log('Fetching all users for approval management...');
      
      // Get ALL users to see what's happening
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Raw database query result:', data);
      console.log('Number of users found:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('First user data:', data[0]);
        console.log('First user role:', data[0].role);
        console.log('First user role type:', typeof data[0].role);
        
        // Log each user individually
        data.forEach((user, index) => {
          console.log(`User ${index + 1}:`, {
            id: user.id,
            role: user.role,
            roleType: typeof user.role,
            email: user.email,
            approval_status: user.approval_status,
            email_verified: user.email_verified
          });
        });
        
        // Test the filtering logic step by step
        console.log('Testing filter logic:');
        data.forEach((user, index) => {
          const isNotAdmin = user.role !== 'admin';
          console.log(`User ${index + 1}: role="${user.role}", isNotAdmin=${isNotAdmin}`);
        });
      }
      
      // Filter out admin users on the frontend
      const nonAdminUsers = (data || []).filter(user => {
        console.log(`Filtering user: ${user.email}, role: "${user.role}", condition: ${user.role !== 'admin'}`);
        return user.role !== 'admin';
      });
      console.log('Non-admin users after filtering:', nonAdminUsers);
      
      setPendingUsers(nonAdminUsers);
    } catch (error: any) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "Error",
        description: "Failed to load pending users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const approveUser = async (userId: string) => {
    if (!user) return;

    try {
      console.log('Approving user:', userId);
      const { error } = await supabase.rpc('approve_user', {
        target_user_id: userId,
        approving_admin_id: user.id
      });

      if (error) {
        console.error('Error approving user:', error);
        throw error;
      }

      // Refresh the user list to show updated status
      await fetchPendingUsers();

      toast({
        title: "User approved",
        description: "User has been successfully approved",
      });
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve user",
        variant: "destructive",
      });
    }
  };

  const rejectUser = async () => {
    if (!user || !rejectionDialog.userId) return;

    try {
      console.log('Rejecting user:', rejectionDialog.userId);
      const { error } = await supabase.rpc('reject_user', {
        target_user_id: rejectionDialog.userId,
        rejecting_admin_id: user.id,
        reason: rejectionReason || 'No reason provided'
      });

      if (error) {
        console.error('Error rejecting user:', error);
        throw error;
      }

      // Refresh the user list to show updated status
      await fetchPendingUsers();

      toast({
        title: "User rejected",
        description: "User has been rejected",
      });

      setRejectionDialog({ open: false, userId: null });
      setRejectionReason("");
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject user",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (user: PendingUser) => {
    if (!user.email_verified) {
      return <Badge variant="outline" className="text-orange-600 border-orange-200"><Mail className="w-3 h-3 mr-1" />Email Pending</Badge>;
    }
    
    switch (user.approval_status) {
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-blue-600 border-blue-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const filteredUsers = pendingUsers.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered users for display:', filteredUsers);
  console.log('Users ready for approval:', filteredUsers.filter(user => 
    user.email_verified && user.approval_status === 'pending'
  ));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Approval Management</CardTitle>
              <CardDescription>
                Approve or reject user registrations ({pendingUsers.length} users found)
                {pendingUsers.length > 0 && (
                  <div className="mt-2 text-sm">
                    <div>Email verified: {pendingUsers.filter(u => u.email_verified).length}</div>
                    <div>Pending approval: {pendingUsers.filter(u => u.email_verified && u.approval_status === 'pending').length}</div>
                    <div>Already approved: {pendingUsers.filter(u => u.approval_status === 'approved').length}</div>
                    <div>Rejected: {pendingUsers.filter(u => u.approval_status === 'rejected').length}</div>
                  </div>
                )}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPendingUsers}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="search">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.email_verified && user.approval_status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveUser(user.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejectionDialog({ open: true, userId: user.id })}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {user.approval_status === 'rejected' && user.rejected_reason && (
                        <div className="text-sm text-red-600">
                          Reason: {user.rejected_reason}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No users found
                {pendingUsers.length === 0 ? " - No users have registered yet" : " matching your search"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={rejectionDialog.open} onOpenChange={(open) => setRejectionDialog({ open, userId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject User Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this user's registration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialog({ open: false, userId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={rejectUser}>
              Reject User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserApprovalManagement;
