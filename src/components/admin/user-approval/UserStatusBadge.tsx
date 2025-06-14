
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";

interface UserStatusBadgeProps {
  emailVerified: boolean;
  approvalStatus: string;
}

export const UserStatusBadge = ({ emailVerified, approvalStatus }: UserStatusBadgeProps) => {
  if (!emailVerified) {
    return (
      <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800">
        <Mail className="w-3 h-3 mr-1" />
        Email Pending
      </Badge>
    );
  }
  
  switch (approvalStatus) {
    case 'approved':
      return (
        <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
  }
};
