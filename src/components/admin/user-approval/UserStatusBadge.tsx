
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";

interface UserStatusBadgeProps {
  emailVerified: boolean;
  approvalStatus: string;
}

export const UserStatusBadge = ({ emailVerified, approvalStatus }: UserStatusBadgeProps) => {
  if (!emailVerified) {
    return (
      <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
        <Mail className="w-3 h-3 mr-1" />
        Email Pending
      </Badge>
    );
  }
  
  switch (approvalStatus) {
    case 'approved':
      return (
        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-info border-info/30 bg-info/10">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
  }
};
