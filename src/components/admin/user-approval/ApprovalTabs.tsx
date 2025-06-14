
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
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pending" className="relative">
          Needs Approval
          {pendingApprovalUsers.length > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {pendingApprovalUsers.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="email-pending" className="relative">
          Email Pending
          {emailPendingUsers.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
              {emailPendingUsers.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="processed">
          Processed
          {processedUsers.length > 0 && (
            <Badge variant="outline" className="ml-2 h-5 w-5 p-0 text-xs">
              {processedUsers.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="all">All Users</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Users Awaiting Approval</h3>
          <p className="text-sm text-gray-600">
            These users have verified their email and are ready for approval.
          </p>
        </div>
        {filteredPendingUsers.length > 0 ? (
          <UserTable users={filteredPendingUsers} showActions={true} onApprove={onApprove} onReject={onReject} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No users pending approval</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="email-pending" className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Email Verification Pending</h3>
          <p className="text-sm text-gray-600">
            These users need to verify their email addresses before they can be approved.
          </p>
        </div>
        {filteredEmailPendingUsers.length > 0 ? (
          <UserTable users={filteredEmailPendingUsers} onApprove={onApprove} onReject={onReject} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No users with pending email verification</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="processed" className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Processed Users</h3>
          <p className="text-sm text-gray-600">
            Users who have been approved or rejected.
          </p>
        </div>
        {filteredProcessedUsers.length > 0 ? (
          <UserTable users={filteredProcessedUsers} onApprove={onApprove} onReject={onReject} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No processed users</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="all" className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
          <p className="text-sm text-gray-600">
            Complete list of all registered users.
          </p>
        </div>
        {filteredAllUsers.length > 0 ? (
          <UserTable users={filteredAllUsers} showActions={true} onApprove={onApprove} onReject={onReject} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No users found
              {allUsers.length === 0 ? " - No users have registered yet" : " matching your search"}
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
