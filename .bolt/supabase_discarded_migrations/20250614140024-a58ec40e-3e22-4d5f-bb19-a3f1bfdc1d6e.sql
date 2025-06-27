
-- Add new columns to user_profiles table for approval workflow
ALTER TABLE public.user_profiles 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN admin_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN rejected_reason TEXT;

-- Create a table to store known disposable email domains
CREATE TABLE public.disposable_email_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert some common disposable email domains
INSERT INTO public.disposable_email_domains (domain) VALUES
('10minutemail.com'),
('guerrillamail.com'),
('mailinator.com'),
('tempmail.org'),
('yopmail.com'),
('throwaway.email'),
('temp-mail.org'),
('getnada.com'),
('maildrop.cc'),
('sharklasers.com');

-- Create function to check if email domain is disposable
CREATE OR REPLACE FUNCTION public.is_disposable_email(email_address TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.disposable_email_domains 
    WHERE domain = LOWER(SPLIT_PART(email_address, '@', 2))
  );
$$;

-- Create function to handle user approval
CREATE OR REPLACE FUNCTION public.approve_user(
  target_user_id UUID,
  approving_admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the approving user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = approving_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can approve users';
  END IF;

  -- Update the user's approval status
  UPDATE public.user_profiles 
  SET 
    admin_approved = TRUE,
    approval_status = 'approved',
    approved_by = approving_admin_id,
    approved_at = now()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- Create function to reject user
CREATE OR REPLACE FUNCTION public.reject_user(
  target_user_id UUID,
  rejecting_admin_id UUID,
  reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the rejecting user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = rejecting_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can reject users';
  END IF;

  -- Update the user's approval status
  UPDATE public.user_profiles 
  SET 
    admin_approved = FALSE,
    approval_status = 'rejected',
    approved_by = rejecting_admin_id,
    approved_at = now(),
    rejected_reason = reason
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- Update the handle_new_user function to include email verification check
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if email is from a disposable domain
  IF public.is_disposable_email(new.email) THEN
    RAISE EXCEPTION 'Disposable email addresses are not allowed';
  END IF;

  INSERT INTO public.user_profiles (
    id, 
    username, 
    full_name, 
    email, 
    role,
    email_verified,
    admin_approved,
    approval_status
  )
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.email,
    'candidate',
    new.email_confirmed_at IS NOT NULL,
    FALSE,
    'pending'
  );
  
  RETURN new;
END;
$$;
