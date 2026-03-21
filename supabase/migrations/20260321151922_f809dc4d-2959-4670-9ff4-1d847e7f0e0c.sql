
CREATE TABLE public.ad_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name text NOT NULL UNIQUE,
  slot_label text NOT NULL DEFAULT '',
  ad_key text DEFAULT '',
  ad_type text NOT NULL DEFAULT 'banner',
  is_enabled boolean NOT NULL DEFAULT false,
  width integer DEFAULT 728,
  height integer DEFAULT 90,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read ad settings (needed to show ads)
CREATE POLICY "Anyone can read ad_settings"
  ON public.ad_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can modify
CREATE POLICY "Admins can update ad_settings"
  ON public.ad_settings FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert ad_settings"
  ON public.ad_settings FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete ad_settings"
  ON public.ad_settings FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default ad slots
INSERT INTO public.ad_settings (slot_name, slot_label, ad_type, width, height) VALUES
  ('hero_below', 'Hero এর নিচে ব্যানার', 'banner', 728, 90),
  ('between_rows_1', 'Trending ও Now Playing এর মাঝে', 'banner', 728, 90),
  ('between_rows_2', 'Top Rated ও TV Shows এর মাঝে', 'banner', 468, 60),
  ('between_rows_3', 'Popular ও Upcoming এর মাঝে', 'banner', 728, 90),
  ('footer_above', 'Footer এর উপরে ব্যানার', 'banner', 728, 90),
  ('player_reward', 'Play বাটনে ক্লিক - রিওয়ার্ড অ্যাড', 'reward', 460, 320),
  ('sidebar_sticky', 'সাইডবার স্টিকি অ্যাড', 'banner', 300, 250);
