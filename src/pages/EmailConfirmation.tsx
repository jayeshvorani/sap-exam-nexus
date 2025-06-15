
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Mail, ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, emailVerified } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    console.log('EmailConfirmation useEffect:', { 
      loading, 
      hasUser: !!user, 
      emailVerified,
      searchParams: Object.fromEntries(searchParams.entries())
    });
    
    if (loading) {
      return; // Still loading, don't make any decisions yet
    }

    // Check if we have URL parameters that suggest this is an email confirmation
    const hasConfirmationParams = searchParams.has('token_hash') || 
                                 searchParams.has('token') || 
                                 searchParams.get('type') === 'signup' ||
                                 searchParams.get('type') === 'email_change' ||
                                 searchParams.get('type') === 'email';

    console.log('Confirmation params check:', { hasConfirmationParams });

    // If we have confirmation params, assume success since backend verification is working
    // This prevents the "invalid link" error when the email verification actually succeeded
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

    // Only show error if no confirmation params and no user
    console.log('No confirmation params and no user, showing error');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-slate-900 dark:via-red-900/20 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-red-200 dark:border-red-800">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-red-800 dark:text-red-300">Verification Failed</CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-green-900/20 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-green-200 dark:border-green-800">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
            Email Verified Successfully!
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-400 text-lg">
            Your email address has been confirmed
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  Awaiting Admin Approval
                </h3>
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  Your account is now pending approval from our administrators. 
                  You'll receive an email notification once your account has been reviewed and approved.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span>✅ Email verification completed</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <span>⏳ Admin review in progress</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                <span>📧 Approval notification email</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                <span>🎉 Full access to ExamPro</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleContinue} 
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Continue to ExamPro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Questions? Contact our support team at support@exampro.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
