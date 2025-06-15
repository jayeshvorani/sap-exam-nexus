
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, XCircle, Mail, Shield } from "lucide-react";

interface ApprovalStatusBannerProps {
  emailVerified: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  userEmail?: string;
}

export const ApprovalStatusBanner = ({ emailVerified, approvalStatus, userEmail }: ApprovalStatusBannerProps) => {
  if (!emailVerified) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <Mail className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Email Verification Required:</strong> Please check your email ({userEmail}) and click the confirmation link to verify your account before proceeding.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === 'pending') {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Account Under Review:</strong> Your email has been verified! Your account is currently being reviewed by our administrators. You'll be notified via email once approved.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === 'rejected') {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Account Not Approved:</strong> Your account registration was not approved. Please contact our support team at support@exampro.com for assistance.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === 'approved') {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Account Approved:</strong> Welcome to ExamPro! Your account has been approved and you now have full access to all features.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
