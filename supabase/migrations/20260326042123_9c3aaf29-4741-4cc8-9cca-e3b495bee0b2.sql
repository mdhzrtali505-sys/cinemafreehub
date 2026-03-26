
ALTER TABLE public.ad_settings ADD COLUMN IF NOT EXISTS layout_key text DEFAULT '';

-- Update ad types to match AdSense format names and set layout keys
UPDATE public.ad_settings SET ad_type = 'in-feed', layout_key = '-6t+ed+2i-1n-4w' WHERE ad_key = '7735953238';
UPDATE public.ad_settings SET ad_type = 'in-article' WHERE ad_key = '4856706709';
UPDATE public.ad_settings SET ad_type = 'multiplex' WHERE ad_key = '9525142660';
UPDATE public.ad_settings SET ad_type = 'display' WHERE ad_key = '6348581889';
