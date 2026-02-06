-- Fix 1: Restrict profiles table - require authentication to view public profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view public profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING ((is_public = true) OR (auth.uid() = user_id));

-- Fix 2: Restrict user_follows table - require authentication to view follows
DROP POLICY IF EXISTS "Anyone can view follows" ON public.user_follows;

CREATE POLICY "Authenticated users can view follows"
ON public.user_follows
FOR SELECT
TO authenticated
USING (true);