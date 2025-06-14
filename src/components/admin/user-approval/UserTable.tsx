
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserTableRow } from "./UserTableRow";

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

interface UserTableProps {
  users: PendingUser[];
  showActions?: boolean;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export const UserTable = ({ users, showActions = false, onApprove, onReject }: UserTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Registered</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserTableRow
            key={user.id}
            user={user}
            showActions={showActions}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </TableBody>
    </Table>
  );
};
