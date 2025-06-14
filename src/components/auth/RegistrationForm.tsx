
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "./PasswordInput";

interface FormData {
  username: string;
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  formData: FormData;
  onFormDataChange: (formData: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  passwordsMatch: boolean;
  passwordLength: boolean;
  onLogin: () => void;
}

const RegistrationForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  loading,
  passwordsMatch,
  passwordLength,
  onLogin
}: RegistrationFormProps) => {
  const updateFormData = (field: keyof FormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => updateFormData('fullName', e.target.value)}
          required
          className="h-12 border-border/50 bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="johndoe"
          value={formData.username}
          onChange={(e) => updateFormData('username', e.target.value)}
          required
          className="h-12 border-border/50 bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          required
          className="h-12 border-border/50 bg-background"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(value) => updateFormData('password', value)}
          showValidation={true}
          isValid={passwordLength}
          validationText="At least 6 characters"
          required={true}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(value) => updateFormData('confirmPassword', value)}
          showValidation={!!formData.confirmPassword}
          isValid={passwordsMatch}
          validationText="Passwords match"
          required={true}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 mt-6 gradient-primary text-white shadow-elegant hover:shadow-lg transition-all duration-300" 
        disabled={loading || !passwordsMatch || !passwordLength}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLogin}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in here
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;
