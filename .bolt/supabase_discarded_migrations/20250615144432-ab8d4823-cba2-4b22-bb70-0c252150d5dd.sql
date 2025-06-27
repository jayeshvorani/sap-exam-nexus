
-- Add is_active column to user_profiles table for temporary deactivation
ALTER TABLE public.user_profiles 
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Create function to deactivate a user
CREATE OR REPLACE FUNCTION public.deactivate_user(
  target_user_id UUID,
  admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the admin user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can deactivate users';
  END IF;

  -- Check if target user exists and is not an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = target_user_id AND role != 'admin'
  ) THEN
    RAISE EXCEPTION 'User not found or cannot deactivate admin users';
  END IF;

  -- Deactivate the user
  UPDATE public.user_profiles 
  SET 
    is_active = FALSE,
    updated_at = now()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- Create function to reactivate a user
CREATE OR REPLACE FUNCTION public.reactivate_user(
  target_user_id UUID,
  admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the admin user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can reactivate users';
  END IF;

  -- Reactivate the user
  UPDATE public.user_profiles 
  SET 
    is_active = TRUE,
    updated_at = now()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- Create function to permanently delete a user (admin only)
CREATE OR REPLACE FUNCTION public.delete_user_permanently(
  target_user_id UUID,
  admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the admin user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can permanently delete users';
  END IF;

  -- Check if target user exists and is not an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = target_user_id AND role != 'admin'
  ) THEN
    RAISE EXCEPTION 'User not found or cannot delete admin users';
  END IF;

  -- Delete related data first (cascade should handle most, but being explicit)
  DELETE FROM public.user_exam_assignments WHERE user_id = target_user_id;
  DELETE FROM public.exam_attempts WHERE user_id = target_user_id;
  
  -- Delete from user_profiles (this will cascade to auth.users due to foreign key)
  DELETE FROM public.user_profiles WHERE id = target_user_id;
  
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- Update existing functions to consider is_active status
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = user_id AND role = 'admin' AND is_active = TRUE
  );
$$;
