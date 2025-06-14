
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
      toast({
        title: "Account created successfully!",
        description: "Welcome to SAP Exam Nexus. You can now start taking exams.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error?.message || "Please check your information and try again.";
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AppHeader onBack={onBack} />

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-light">Create Your Account</CardTitle>
            <CardDescription>
              Start your SAP certification journey today
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
