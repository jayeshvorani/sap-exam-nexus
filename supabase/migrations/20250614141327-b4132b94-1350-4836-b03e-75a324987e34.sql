
-- Update existing admin accounts to be verified and approved
UPDATE public.user_profiles 
SET 
  email_verified = TRUE,
  admin_approved = TRUE,
  approval_status = 'approved',
  approved_at = now()
WHERE role = 'admin';

-- Also update any existing users who were created before the approval system
-- This ensures existing users don't get locked out
UPDATE public.user_profiles 
SET 
  email_verified = TRUE,
  admin_approved = TRUE,
  approval_status = 'approved',
  approved_at = now()
WHERE created_at < (SELECT created_at FROM public.user_profiles WHERE email_verified = FALSE LIMIT 1);
