
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";

interface UserStatusBadgeProps {
  emailVerified: boolean;
  approvalStatus: string;
}

export const UserStatusBadge = ({ emailVerified, approvalStatus }: UserStatusBadgeProps) => {
  if (!emailVerified) {
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-200">
        <Mail className="w-3 h-3 mr-1" />
        Email Pending
      </Badge>
    );
  }
  
  switch (approvalStatus) {
    case 'approved':
      return (
        <Badge variant="outline" className="text-green-600 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="text-red-600 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
  }
};
