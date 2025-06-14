
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import RegistrationForm from "./RegistrationForm";
import AppHeader from "./AppHeader";

interface RegisterFormProps {
  onBack: () => void;
  onLogin: () => void;
}

const RegisterForm = ({ onBack, onLogin }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordLength = formData.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast({
        title: "Password mismatch",
        description: "Passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordLength) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log("Starting registration process...");
      await signUp(formData.email, formData.password, formData.username, formData.fullName);
      console.log("Registration successful");
      
      // Set registration complete state instead of navigating immediately
      setRegistrationComplete(true);
      
      toast({
        title: "Account created successfully!",
        description: "Please check your email and click the confirmation link to complete your registration. Once verified, your account will be reviewed by an administrator.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Please check your information and try again.";
      
      if (error?.message?.includes('disposable email')) {
        errorMessage = "Disposable email addresses are not allowed. Please use a permanent email address.";
      } else if (error?.message?.includes('email address already exists')) {
        errorMessage = "An account with this email address already exists.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation message after successful registration
  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AppHeader onBack={onBack} />

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-light text-green-600">Registration Submitted</CardTitle>
              <CardDescription>
                Your account is pending verification and approval
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg text-left">
                  <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Check your email ({formData.email}) for a confirmation link</li>
                    <li>2. Click the link to verify your email address</li>
                    <li>3. Wait for admin approval of your account</li>
                    <li>4. You'll be notified once approved</li>
                  </ol>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Both email verification and admin approval are required before you can access the platform.
              </p>
              <div className="pt-4">
                <button
                  onClick={onLogin}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to Sign In
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AppHeader onBack={onBack} />

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-light">Create Your Account</CardTitle>
            <CardDescription>
              Start your certification journey today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationForm
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
              passwordsMatch={passwordsMatch}
              passwordLength={passwordLength}
              onLogin={onLogin}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
