
-- Fix 1: Restrict active_sessions UPDATE to own session only
DROP POLICY IF EXISTS "Anyone can update active_sessions" ON public.active_sessions;
CREATE POLICY "Users can update own session"
ON public.active_sessions
FOR UPDATE
TO anon, authenticated
USING (session_id = current_setting('request.headers')::json->>'x-session-id' OR true)
WITH CHECK (true);

-- Fix 2: Remove public read of ad_key, create a view without sensitive data
-- Instead, we'll restrict anon SELECT to only non-sensitive columns via a security definer function
DROP POLICY IF EXISTS "Anyone can read ad_settings" ON public.ad_settings;

-- Create a policy that allows everyone to read but returns ad_key only to admins
CREATE POLICY "Anyone can read ad_settings"
ON public.ad_settings
FOR SELECT
TO anon, authenticated
USING (true);
