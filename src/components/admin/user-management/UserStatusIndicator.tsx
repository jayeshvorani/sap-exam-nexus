
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Mail, UserX } from "lucide-react";

interface UserStatusIndicatorProps {
  emailVerified: boolean;
  approvalStatus: string;
  isActive: boolean;
}

export const UserStatusIndicator = ({ 
  emailVerified, 
  approvalStatus, 
  isActive 
}: UserStatusIndicatorProps) => {
  // If user is deactivated, show that status prominently
  if (!isActive) {
    return (
      <Badge variant="outline" className="text-red-700 dark:text-red-400 border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950">
        <UserX className="w-3 h-3 mr-1" />
        Deactivated
      </Badge>
    );
  }

  // Otherwise show the normal status flow
  if (!emailVerified) {
    return (
      <Badge variant="outline" className="text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950">
        <Mail className="w-3 h-3 mr-1" />
        Email Pending
      </Badge>
    );
  }
  
  switch (approvalStatus) {
    case 'approved':
      return (
        <Badge variant="outline" className="text-green-700 dark:text-green-400 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-950">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="text-red-700 dark:text-red-400 border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
  }
};
