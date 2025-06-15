
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Search, RefreshCw } from "lucide-react";
import { ApprovalTabs } from "./user-approval/ApprovalTabs";
import { RejectionDialog } from "./user-approval/RejectionDialog";

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
  const [allUsers, setAllUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionDialog, setRejectionDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      console.log('Fetching users for approval management...');
      
      // First, let's update email verification status for all users based on Supabase auth data
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (!authError && authUsers) {
        // Update email verification status in user_profiles based on auth data
        for (const authUser of authUsers.users) {
          if (authUser.email_confirmed_at) {
            await supabase
              .from('user_profiles')
              .update({ 
                email_verified: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', authUser.id)
              .eq('email_verified', false); // Only update if currently false
          }
        }
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Non-admin users found:', data?.length || 0);
      setAllUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
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

      await fetchUsers();

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

  const handleRejectUser = (userId: string) => {
    setRejectionDialog({ open: true, userId });
  };

  const rejectUser = async (reason: string) => {
    if (!user || !rejectionDialog.userId) return;

    try {
      console.log('Rejecting user:', rejectionDialog.userId);
      const { error } = await supabase.rpc('reject_user', {
        target_user_id: rejectionDialog.userId,
        rejecting_admin_id: user.id,
        reason: reason || 'No reason provided'
      });

      if (error) {
        console.error('Error rejecting user:', error);
        throw error;
      }

      await fetchUsers();

      toast({
        title: "User rejected",
        description: "User has been rejected",
      });

      setRejectionDialog({ open: false, userId: null });
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject user",
        variant: "destructive",
      });
    }
  };

  const filterUsers = (users: PendingUser[]) => {
    return users.filter(user => 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Separate users into categories
  const pendingApprovalUsers = allUsers.filter(user => 
    user.email_verified && user.approval_status === 'pending'
  );
  
  const emailPendingUsers = allUsers.filter(user => !user.email_verified);
  
  const processedUsers = allUsers.filter(user => 
    user.email_verified && (user.approval_status === 'approved' || user.approval_status === 'rejected')
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading users...</p>
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
                Manage user registrations and approvals ({allUsers.length} total users)
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
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
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ApprovalTabs
            pendingApprovalUsers={pendingApprovalUsers}
            emailPendingUsers={emailPendingUsers}
            processedUsers={processedUsers}
            allUsers={allUsers}
            filteredPendingUsers={filterUsers(pendingApprovalUsers)}
            filteredEmailPendingUsers={filterUsers(emailPendingUsers)}
            filteredProcessedUsers={filterUsers(processedUsers)}
            filteredAllUsers={filterUsers(allUsers)}
            onApprove={approveUser}
            onReject={handleRejectUser}
          />
        </CardContent>
      </Card>

      <RejectionDialog
        open={rejectionDialog.open}
        onOpenChange={(open) => setRejectionDialog({ open, userId: null })}
        onReject={rejectUser}
      />
    </>
  );
};

export default UserApprovalManagement;
