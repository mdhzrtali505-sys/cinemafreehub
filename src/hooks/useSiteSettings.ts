import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
}

let cachedSettings: SiteSettings | null = null;
let cacheTime = 0;
const CACHE_DURATION = 60000; // 1 min

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings && Date.now() - cacheTime < CACHE_DURATION) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("id, site_name, logo_url")
        .limit(1)
        .single();
      if (data) {
        cachedSettings = data as SiteSettings;
        cacheTime = Date.now();
        setSettings(cachedSettings);
      }
      setLoading(false);
    })();
  }, []);

  return { settings, loading };
}

export function invalidateSiteSettingsCache() {
  cachedSettings = null;
  cacheTime = 0;
}
