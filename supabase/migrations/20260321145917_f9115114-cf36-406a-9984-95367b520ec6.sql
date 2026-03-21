
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: only admins can read user_roles
CREATE POLICY "Admins can view roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Page views tracking table
CREATE TABLE public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page_views"
ON public.page_views FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read page_views"
ON public.page_views FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Movie clicks tracking
CREATE TABLE public.movie_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id INTEGER NOT NULL,
    movie_title TEXT NOT NULL,
    action TEXT NOT NULL DEFAULT 'play',
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.movie_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert movie_clicks"
ON public.movie_clicks FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read movie_clicks"
ON public.movie_clicks FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Active sessions table for real-time tracking
CREATE TABLE public.active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL UNIQUE,
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
    current_page TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can upsert active_sessions"
ON public.active_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update active_sessions"
ON public.active_sessions FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can read active_sessions"
ON public.active_sessions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Cleanup function for old sessions (>5 min inactive)
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.active_sessions WHERE last_seen < now() - interval '5 minutes';
$$;
