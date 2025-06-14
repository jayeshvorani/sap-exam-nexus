
import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const supabaseUrl = "https://mqycxtydeqhwvdsjuuwo.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xeWN4dHlkZXFod3Zkc2p1dXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTc1MDMsImV4cCI6MjA2NTQ3MzUwM30.Ys4UR4oyKE-mU09QHTgsO__wiC47QuGY7sw-G5dctNo";
  
  return !!(supabaseUrl && supabaseKey && supabaseUrl !== "your-project-url" && supabaseKey !== "your-anon-key");
};
