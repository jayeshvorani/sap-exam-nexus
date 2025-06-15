
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, XCircle, Mail } from "lucide-react";

interface ApprovalStatusBannerProps {
  emailVerified: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  userEmail?: string;
}

export const ApprovalStatusBanner = ({ emailVerified, approvalStatus, userEmail }: ApprovalStatusBannerProps) => {
  if (!emailVerified) {
    return (
      <Alert className="border-warning/30 bg-warning/10">
        <Mail className="h-4 w-4 text-warning" />
        <AlertDescription className="text-foreground">
          <strong>Email Verification Required:</strong> Please check your email ({userEmail}) and click the confirmation link to verify your account.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === 'pending') {
    return (
      <Alert className="border-info/30 bg-info/10">
        <Clock className="h-4 w-4 text-info" />
        <AlertDescription className="text-foreground">
          <strong>Approval Pending:</strong> Your account is pending admin approval. You'll be notified once approved.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === 'rejected') {
    return (
      <Alert className="border-destructive/30 bg-destructive/10">
        <XCircle className="h-4 w-4 text-destructive inline mr-2" />
        <AlertDescription className="text-foreground">
          <strong>Account Rejected:</strong> Your account registration has been rejected. Please contact support for more information.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === 'approved') {
    return (
      <Alert className="border-success/30 bg-success/10">
        <CheckCircle className="h-4 w-4 text-success" />
        <AlertDescription className="text-foreground">
          <strong>Account Approved:</strong> Your account has been approved and you can now access all features.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
