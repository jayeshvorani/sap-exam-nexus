
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

interface PasswordInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showValidation?: boolean;
  isValid?: boolean;
  validationText?: string;
  required?: boolean;
}

const PasswordInput = ({ 
  id, 
  placeholder, 
  value, 
  onChange, 
  showValidation = false,
  isValid = false,
  validationText = "",
  required = false 
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="h-12 pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
      {showValidation && value && (
        <div className="flex items-center space-x-2 text-sm">
          {isValid ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span className={isValid ? "text-green-600" : "text-red-600"}>
            {validationText}
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
