-- Fix the handle_new_user function to bypass RLS policies
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a default admin user profile (you'll need to create the auth user separately)
-- First, let's create a sample admin profile for testing
INSERT INTO public.profiles (user_id, email, full_name, role) 
VALUES (
  gen_random_uuid(), 
  'admin@barangay.gov', 
  'System Administrator', 
  'admin'
) ON CONFLICT (user_id) DO NOTHING;