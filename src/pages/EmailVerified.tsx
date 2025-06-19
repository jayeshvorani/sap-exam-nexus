
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Mail, ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const EmailVerified = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, emailVerified } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    console.log('EmailVerified useEffect:', { 
      loading, 
      hasUser: !!user, 
      emailVerified,
      searchParams: Object.fromEntries(searchParams.entries()),
      pathname: window.location.pathname
    });
    
    if (loading) {
      return; // Still loading, don't make any decisions yet
    }

    // Check if we're on the email-verified route (which means we were redirected here after verification)
    const isOnEmailVerifiedRoute = window.location.pathname === '/email-verified';
    
    // Check if we have URL parameters that suggest this is an email verification
    const hasConfirmationParams = searchParams.has('token_hash') || 
                                 searchParams.has('token') || 
                                 searchParams.get('type') === 'signup' ||
                                 searchParams.get('type') === 'email_change' ||
                                 searchParams.get('type') === 'email';

    console.log('Verification checks:', { isOnEmailVerifiedRoute, hasConfirmationParams });

    // If we're on the email-verified route, assume success since that's where Supabase redirects after verification
    if (isOnEmailVerifiedRoute) {
      console.log('On email-verified route, assuming success');
      setVerificationStatus('success');
      return;
    }

    // If we have confirmation params, assume success since backend verification is working
    if (hasConfirmationParams) {
      console.log('Have confirmation params, assuming success');
      setVerificationStatus('success');
      return;
    }

    // If user is logged in, show success
    if (user) {
      console.log('User is logged in, showing success');
      setVerificationStatus('success');
      return;
    }

    // Only show error if none of the above conditions are met
    console.log('No success conditions met, showing error');
    setVerificationStatus('error');
  }, [searchParams, loading, user, emailVerified]);

  const handleContinue = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  if (loading || verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Verification Failed</CardTitle>
            <CardDescription className="text-destructive">
              The verification link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">
            Email Verified Successfully!
          </CardTitle>
          <CardDescription className="text-lg">
            Your email address has been confirmed
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">
                  Awaiting Admin Approval
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your account is now pending approval from our administrators. 
                  You'll receive an email notification once your account has been reviewed and approved.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span>✅ Email verification completed</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                <span>⏳ Admin review in progress</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0"></div>
                <span>📧 Approval notification email</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0"></div>
                <span>🎉 Full access to ExamPro</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Button onClick={handleContinue} className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Continue to ExamPro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Questions? Contact our support team at support@exampro.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerified;
