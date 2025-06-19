
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, ArrowLeft } from "lucide-react";

interface SSOLoginFormProps {
  onBack: () => void;
}

export const SSOLoginForm = ({ onBack }: SSOLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSSOLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Extract domain from email
      const domain = email.split('@')[1];
      
      if (!domain) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if domain is configured for SSO
      const { data: ssoConfig, error } = await supabase
        .from('enterprise_sso_domains')
        .select(`
          domain,
          is_active,
          social_auth_providers (
            provider_name,
            provider_type,
            is_enabled,
            configuration
          )
        `)
        .eq('domain', domain)
        .eq('is_active', true)
        .single();

      if (error || !ssoConfig) {
        toast({
          title: "SSO not configured",
          description: "Single Sign-On is not configured for your organization. Please contact your administrator.",
          variant: "destructive",
        });
        return;
      }

      // Redirect to SSO provider
      const provider = ssoConfig.social_auth_providers;
      if (provider?.is_enabled) {
        toast({
          title: "Redirecting to SSO",
          description: `Redirecting to ${provider.provider_name} for authentication...`,
        });
        
        // Here you would typically redirect to the SSO provider
        // For now, we'll show a message
        setTimeout(() => {
          toast({
            title: "SSO Integration",
            description: "SSO integration would be handled here in a production environment.",
          });
        }, 2000);
      } else {
        toast({
          title: "SSO not available",
          description: "SSO is not currently available for your organization.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('SSO error:', error);
      toast({
        title: "SSO failed",
        description: "Failed to initiate SSO login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="glass border-border/50 shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-light">Enterprise SSO</CardTitle>
          <CardDescription>
            Sign in using your organization's Single Sign-On
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSSOLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-border/50 bg-background"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "Checking SSO..." : "Continue with SSO"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have enterprise SSO?{" "}
              <button
                onClick={onBack}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Use regular sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
