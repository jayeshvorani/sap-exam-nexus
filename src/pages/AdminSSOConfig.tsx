
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Plus, Trash2, Building2 } from "lucide-react";

interface SocialProvider {
  id: string;
  provider_name: string;
  provider_type: string;
  is_enabled: boolean;
  client_id?: string;
  client_secret?: string;
}

interface SSODomain {
  id: string;
  domain: string;
  is_active: boolean;
  provider_id: string;
  social_auth_providers?: SocialProvider;
}

const AdminSSOConfig = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [providers, setProviders] = useState<SocialProvider[]>([]);
  const [domains, setDomains] = useState<SSODomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/dashboard");
      return;
    }
    
    fetchConfiguration();
  }, [user, isAdmin, navigate]);

  const fetchConfiguration = async () => {
    try {
      setLoading(true);
      
      // Fetch social providers
      const { data: providersData, error: providersError } = await supabase
        .from('social_auth_providers')
        .select('*')
        .order('provider_name');

      if (providersError) throw providersError;

      // Fetch SSO domains
      const { data: domainsData, error: domainsError } = await supabase
        .from('enterprise_sso_domains')
        .select(`
          *,
          social_auth_providers (*)
        `)
        .order('domain');

      if (domainsError) throw domainsError;

      setProviders(providersData || []);
      setDomains(domainsData || []);
    } catch (error: any) {
      console.error('Error fetching SSO configuration:', error);
      toast({
        title: "Error",
        description: "Failed to load SSO configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProvider = async (providerId: string, updates: Partial<SocialProvider>) => {
    try {
      const { error } = await supabase
        .from('social_auth_providers')
        .update(updates)
        .eq('id', providerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Provider updated successfully",
      });
      
      fetchConfiguration();
    } catch (error: any) {
      console.error('Error updating provider:', error);
      toast({
        title: "Error",
        description: "Failed to update provider",
        variant: "destructive",
      });
    }
  };

  const addSSODomain = async () => {
    if (!newDomain.trim()) return;

    try {
      const { error } = await supabase
        .from('enterprise_sso_domains')
        .insert({
          domain: newDomain.toLowerCase().trim(),
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "SSO domain added successfully",
      });
      
      setNewDomain("");
      fetchConfiguration();
    } catch (error: any) {
      console.error('Error adding SSO domain:', error);
      toast({
        title: "Error",
        description: "Failed to add SSO domain",
        variant: "destructive",
      });
    }
  };

  const removeSSODomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to remove this SSO domain?')) return;

    try {
      const { error } = await supabase
        .from('enterprise_sso_domains')
        .delete()
        .eq('id', domainId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "SSO domain removed successfully",
      });
      
      fetchConfiguration();
    } catch (error: any) {
      console.error('Error removing SSO domain:', error);
      toast({
        title: "Error",
        description: "Failed to remove SSO domain",
        variant: "destructive",
      });
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-elegant">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gradient">SSO Configuration</h1>
            </div>
            <Button onClick={() => navigate("/admin")} variant="outline">
              Back to Admin
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="providers">Social Providers</TabsTrigger>
            <TabsTrigger value="domains">Enterprise Domains</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Authentication Providers</CardTitle>
                <CardDescription>
                  Configure social login providers for your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant={provider.is_enabled ? "default" : "secondary"}>
                          {provider.provider_name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {provider.provider_type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={provider.is_enabled}
                          onCheckedChange={(checked) => 
                            updateProvider(provider.id, { is_enabled: checked })
                          }
                        />
                        <span className="text-sm">
                          {provider.is_enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enterprise SSO Domains</CardTitle>
                <CardDescription>
                  Manage domains that are configured for Single Sign-On
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="company.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addSSODomain} disabled={!newDomain.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Domain
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {domains.map((domain) => (
                      <div key={domain.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{domain.domain}</span>
                          <Badge variant={domain.is_active ? "default" : "secondary"}>
                            {domain.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSSODomain(domain.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {domains.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No SSO domains configured yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSSOConfig;
