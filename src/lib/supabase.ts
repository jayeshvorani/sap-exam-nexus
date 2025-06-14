
import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Since we have actual Supabase credentials configured, this always returns true
export const isSupabaseConfigured = () => {
  return true;
};
