-- ============================================
-- GRANT ADMIN ROLE TO USER
-- This script grants admin role to 2024ehsan@gmail.com
-- ============================================

-- First, find the user by email
DO $$
DECLARE
  target_email TEXT := '2024ehsan@gmail.com';
  user_uuid UUID;
  existing_role TEXT;
BEGIN
  -- Find user ID by email
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = target_email;

  -- Check if user exists
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Make sure the user has signed up first.', target_email;
  END IF;

  -- Check if user already has a role
  SELECT role INTO existing_role
  FROM public.user_roles
  WHERE user_id = user_uuid;

  -- Insert or update the role
  IF existing_role IS NULL THEN
    -- Insert new role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_uuid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role granted to user: % (ID: %)', target_email, user_uuid;
  ELSIF existing_role != 'admin' THEN
    -- Update existing role to admin
    UPDATE public.user_roles
    SET role = 'admin'
    WHERE user_id = user_uuid;
    
    RAISE NOTICE 'User role updated to admin for: % (ID: %)', target_email, user_uuid;
  ELSE
    RAISE NOTICE 'User % already has admin role (ID: %)', target_email, user_uuid;
  END IF;

  -- Verify the role was set
  SELECT role INTO existing_role
  FROM public.user_roles
  WHERE user_id = user_uuid AND role = 'admin';

  IF existing_role = 'admin' THEN
    RAISE NOTICE '✓ Success! User % now has admin role.', target_email;
  ELSE
    RAISE EXCEPTION 'Failed to grant admin role to user.';
  END IF;
END $$;

-- Verify the result
SELECT 
  u.email,
  ur.role,
  ur.created_at as role_granted_at,
  p.full_name
FROM auth.users u
JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = '2024ehsan@gmail.com';

