
-- Enable Row Level Security on disposable_email_domains table
ALTER TABLE public.disposable_email_domains ENABLE ROW LEVEL SECURITY;

-- Create a restrictive policy that prevents all public access
-- Only database functions with SECURITY DEFINER will be able to access this table
CREATE POLICY "No public access to disposable email domains" 
ON public.disposable_email_domains 
FOR ALL 
TO authenticated, anon
USING (false);
