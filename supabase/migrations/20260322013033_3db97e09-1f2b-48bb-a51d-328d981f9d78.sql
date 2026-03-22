
-- site_settings table
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'CinemaFreeHub',
  logo_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Anyone can read site_settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Only admins can update
CREATE POLICY "Admins can update site_settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.site_settings (site_name) VALUES ('CinemaFreeHub');

-- Storage bucket for site assets
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- Public read for site-assets
CREATE POLICY "Public read site-assets" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'site-assets');

-- Admin upload to site-assets
CREATE POLICY "Admin upload site-assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Admin update site-assets
CREATE POLICY "Admin update site-assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Admin delete site-assets
CREATE POLICY "Admin delete site-assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'::app_role));
