
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
      <Badge variant="outline" className="text-red-800 dark:text-red-200 border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30 font-semibold">
        <UserX className="w-3 h-3 mr-1" />
        Deactivated
      </Badge>
    );
  }

  // Otherwise show the normal status flow
  if (!emailVerified) {
    return (
      <Badge variant="outline" className="text-orange-800 dark:text-orange-200 border-orange-400 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/30 font-semibold">
        <Mail className="w-3 h-3 mr-1" />
        Email Pending
      </Badge>
    );
  }
  
  switch (approvalStatus) {
    case 'approved':
      return (
        <Badge variant="outline" className="text-green-800 dark:text-green-200 border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/30 font-semibold">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="text-red-800 dark:text-red-200 border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30 font-semibold">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-blue-800 dark:text-blue-200 border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 font-semibold">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
  }
};
