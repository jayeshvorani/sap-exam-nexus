
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "./UserTable";

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

interface ApprovalTabsProps {
  pendingApprovalUsers: PendingUser[];
  emailPendingUsers: PendingUser[];
  processedUsers: PendingUser[];
  allUsers: PendingUser[];
  filteredPendingUsers: PendingUser[];
  filteredEmailPendingUsers: PendingUser[];
  filteredProcessedUsers: PendingUser[];
  filteredAllUsers: PendingUser[];
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export const ApprovalTabs = ({
  pendingApprovalUsers,
  emailPendingUsers,
  processedUsers,
  allUsers,
  filteredPendingUsers,
  filteredEmailPendingUsers,
  filteredProcessedUsers,
  filteredAllUsers,
  onApprove,
  onReject,
}: ApprovalTabsProps) => {
  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800">
        <TabsTrigger 
          value="pending" 
          className="relative text-slate-700 dark:text-slate-200 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 font-medium"
        >
          Needs Approval
          {pendingApprovalUsers.length > 0 && (
            <Badge variant="destructive" className="ml-2 min-w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full bg-red-600 text-white">
              {pendingApprovalUsers.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="email-pending" 
          className="relative text-slate-700 dark:text-slate-200 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 font-medium"
        >
          Email Pending
          {emailPendingUsers.length > 0 && (
            <Badge variant="secondary" className="ml-2 min-w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full bg-blue-600 text-white">
              {emailPendingUsers.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="processed" 
          className="text-slate-700 dark:text-slate-200 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 font-medium"
        >
          Processed
          {processedUsers.length > 0 && (
            <Badge variant="outline" className="ml-2 min-w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full border-slate-400 text-slate-700 dark:text-slate-300">
              {processedUsers.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="all" 
          className="text-slate-700 dark:text-slate-200 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 font-medium"
        >
          All Users
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Users Awaiting Approval</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            These users have verified their email and are ready for approval.
          </p>
        </div>
        {filteredPendingUsers.length > 0 ? (
          <UserTable users={filteredPendingUsers} showActions={true} onApprove={onApprove} onReject={onReject} />
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">No users pending approval</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="email-pending" className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Email Verification Pending</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            These users need to verify their email addresses before they can be approved.
          </p>
        </div>
        {filteredEmailPendingUsers.length > 0 ? (
          <UserTable users={filteredEmailPendingUsers} onApprove={onApprove} onReject={onReject} />
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">No users with pending email verification</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="processed" className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Processed Users</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Users who have been approved or rejected.
          </p>
        </div>
        {filteredProcessedUsers.length > 0 ? (
          <UserTable users={filteredProcessedUsers} onApprove={onApprove} onReject={onReject} />
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">No processed users</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="all" className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Users</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Complete list of all registered users.
          </p>
        </div>
        {filteredAllUsers.length > 0 ? (
          <UserTable users={filteredAllUsers} showActions={true} onApprove={onApprove} onReject={onReject} />
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              No users found
              {allUsers.length === 0 ? " - No users have registered yet" : " matching your search"}
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
