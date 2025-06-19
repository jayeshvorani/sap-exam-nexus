
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Github, Chrome, Linkedin, Building2 } from "lucide-react";

interface SocialLoginButtonsProps {
  mode: "login" | "register";
}

export const SocialLoginButtons = ({ mode }: SocialLoginButtonsProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin_oidc' | 'azure') => {
    setLoading(provider);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error(`${provider} auth error:`, error);
      toast({
        title: "Authentication failed",
        description: error.message || `Failed to sign in with ${provider}`,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const socialProviders = [
    {
      id: 'google' as const,
      name: 'Google',
      icon: Chrome,
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      id: 'github' as const,
      name: 'GitHub',
      icon: Github,
      color: 'bg-gray-800 hover:bg-gray-900',
    },
    {
      id: 'linkedin_oidc' as const,
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'azure' as const,
      name: 'Microsoft',
      icon: Building2,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or {mode === 'login' ? 'sign in' : 'sign up'} with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {socialProviders.map((provider) => {
          const Icon = provider.icon;
          return (
            <Button
              key={provider.id}
              variant="outline"
              onClick={() => handleSocialLogin(provider.id)}
              disabled={loading === provider.id}
              className={`${provider.color} text-white border-0 hover:text-white transition-colors`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {loading === provider.id ? "..." : provider.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
