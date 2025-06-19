
-- Add indices to improve performance for statistics queries
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_practice ON public.exam_attempts(user_id, is_practice_mode, is_completed);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_completed_practice ON public.exam_attempts(is_completed, is_practice_mode) WHERE is_completed = true;

-- Create a view to help with statistics calculation
CREATE OR REPLACE VIEW public.user_exam_statistics AS
SELECT 
  user_id,
  -- Practice exam stats
  COUNT(*) FILTER (WHERE is_practice_mode = true AND is_completed = true) as practice_exams_completed,
  AVG(score) FILTER (WHERE is_practice_mode = true AND is_completed = true AND score IS NOT NULL) as practice_average_score,
  SUM(CASE 
    WHEN is_practice_mode = true AND start_time IS NOT NULL AND end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 3600.0 
    ELSE 0 
  END) as practice_study_time_hours,
  COUNT(*) FILTER (WHERE is_practice_mode = true AND is_completed = true AND passed = true) as practice_passed_count,
  COUNT(*) FILTER (WHERE is_practice_mode = true AND is_completed = true) as practice_total_count,
  
  -- Real exam stats
  COUNT(*) FILTER (WHERE is_practice_mode = false AND is_completed = true) as real_exams_completed,
  AVG(score) FILTER (WHERE is_practice_mode = false AND is_completed = true AND score IS NOT NULL) as real_average_score,
  SUM(CASE 
    WHEN is_practice_mode = false AND start_time IS NOT NULL AND end_time IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 3600.0 
    ELSE 0 
  END) as real_study_time_hours,
  COUNT(*) FILTER (WHERE is_practice_mode = false AND is_completed = true AND passed = true) as real_passed_count,
  COUNT(*) FILTER (WHERE is_practice_mode = false AND is_completed = true) as real_total_count,
  
  -- Certifications (only from real exams)
  COUNT(*) FILTER (WHERE is_practice_mode = false AND is_completed = true AND passed = true) as certifications_earned
FROM public.exam_attempts
WHERE is_completed = true
GROUP BY user_id;

-- Add social auth providers table for SSO configuration
CREATE TABLE IF NOT EXISTS public.social_auth_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_name TEXT NOT NULL UNIQUE,
  provider_type TEXT NOT NULL, -- 'oauth', 'saml', 'oidc'
  client_id TEXT,
  client_secret TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  configuration JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add enterprise SSO domains table
CREATE TABLE IF NOT EXISTS public.enterprise_sso_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  provider_id UUID REFERENCES public.social_auth_providers(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.social_auth_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_sso_domains ENABLE ROW LEVEL SECURITY;

-- Only admins can manage SSO providers
CREATE POLICY "Only admins can manage SSO providers" ON public.social_auth_providers
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can manage enterprise domains" ON public.enterprise_sso_domains
  FOR ALL USING (public.is_admin(auth.uid()));

-- Insert default social providers
INSERT INTO public.social_auth_providers (provider_name, provider_type, is_enabled) 
VALUES 
  ('google', 'oauth', false),
  ('github', 'oauth', false),
  ('linkedin_oidc', 'oidc', false),
  ('microsoft', 'oauth', false)
ON CONFLICT (provider_name) DO NOTHING;
