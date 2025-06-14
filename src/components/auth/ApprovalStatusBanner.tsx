
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
      <Alert className="border-orange-200 bg-orange-50">
        <Mail className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Email Verification Required:</strong> Please check your email ({userEmail}) and click the confirmation link to verify your account.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === 'pending') {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Approval Pending:</strong> Your account is pending admin approval. You'll be notified once approved.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === 'rejected') {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          <XCircle className="h-4 w-4 text-red-600 inline mr-2" />
          <strong>Account Rejected:</strong> Your account registration has been rejected. Please contact support for more information.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === 'approved') {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Account Approved:</strong> Your account has been approved and you can now access all features.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
