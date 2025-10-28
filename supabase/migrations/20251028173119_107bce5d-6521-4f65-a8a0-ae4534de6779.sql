-- Add rider role to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'rider';

-- Update the trigger to handle rider signup
CREATE OR REPLACE FUNCTION public.assign_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Auto-assign admin role to admin@local.com
  IF NEW.email = 'admin@local.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  -- Auto-assign rider role to rider@local.com
  ELSIF NEW.email = 'rider@local.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'rider')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Auto-assign user role to everyone else
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;