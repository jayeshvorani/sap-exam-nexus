
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

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

interface UserActionsCellProps {
  user: PendingUser;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export const UserActionsCell = ({ user, onApprove, onReject }: UserActionsCellProps) => {
  if (user.email_verified && user.approval_status === 'pending') {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onApprove(user.id)}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(user.id)}
          className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Reject
        </Button>
      </div>
    );
  }

  if (user.approval_status === 'rejected' && user.rejected_reason) {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        Reason: {user.rejected_reason}
      </div>
    );
  }

  return null;
};
