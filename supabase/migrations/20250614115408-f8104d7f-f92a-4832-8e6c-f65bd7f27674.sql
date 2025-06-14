
-- Update the current user's role to admin
-- Replace 'your-email@example.com' with the actual email you used to register
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- If you're not sure of the exact email, you can see all users with this query:
-- SELECT id, email, username, full_name, role FROM public.user_profiles;
