
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const AdminPromotion = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const promoteCurrentUser = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Admin privileges granted!",
        description: "You now have admin access. Please refresh the page to see admin options.",
      });
    } catch (error: any) {
      console.error('Error promoting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to grant admin privileges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Admin Setup</CardTitle>
        <CardDescription>
          Click below to grant admin privileges to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Current User:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
          <Button 
            onClick={promoteCurrentUser} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Granting Admin Access..." : "Make Me Admin"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPromotion;
