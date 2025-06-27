
-- Add unique constraint to prevent duplicate email addresses
ALTER TABLE public.user_profiles 
ADD CONSTRAINT unique_email UNIQUE (email);

-- Update the handle_new_user function to handle potential email conflicts more gracefully
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

  -- Check if email already exists (this will be caught by unique constraint but we can provide a clearer error)
  IF EXISTS (SELECT 1 FROM public.user_profiles WHERE email = new.email) THEN
    RAISE EXCEPTION 'An account with this email address already exists';
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
