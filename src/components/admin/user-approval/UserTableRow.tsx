
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserActionsCell } from "./UserActionsCell";

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

interface UserTableRowProps {
  user: PendingUser;
  showActions?: boolean;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export const UserTableRow = ({ user, showActions = false, onApprove, onReject }: UserTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium text-foreground">{user.full_name}</div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
        </div>
      </TableCell>
      <TableCell className="text-foreground">{user.email}</TableCell>
      <TableCell>
        <Badge variant="secondary">{user.role}</Badge>
      </TableCell>
      <TableCell>
        <UserStatusBadge 
          emailVerified={user.email_verified} 
          approvalStatus={user.approval_status} 
        />
      </TableCell>
      <TableCell className="text-foreground">
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      {showActions && (
        <TableCell>
          <UserActionsCell 
            user={user} 
            onApprove={onApprove} 
            onReject={onReject} 
          />
        </TableCell>
      )}
    </TableRow>
  );
};
