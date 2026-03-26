import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdSlot {
  id: string;
  slot_name: string;
  slot_label: string;
  ad_key: string;
  ad_type: string;
  is_enabled: boolean;
  width: number;
  height: number;
  layout_key: string;
}

let cachedSlots: AdSlot[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 min

export function useAdSettings() {
  const [slots, setSlots] = useState<AdSlot[]>(cachedSlots || []);
  const [loading, setLoading] = useState(!cachedSlots);

  useEffect(() => {
    if (cachedSlots && Date.now() - cacheTime < CACHE_TTL) {
      setSlots(cachedSlots);
      setLoading(false);
      return;
    }
    supabase
      .from("ad_settings")
      .select("*")
      .then(({ data }) => {
        if (data) {
          cachedSlots = data as unknown as AdSlot[];
          cacheTime = Date.now();
          setSlots(cachedSlots);
        }
        setLoading(false);
      });
  }, []);

  const getSlot = (slotName: string): AdSlot | undefined =>
    slots.find((s) => s.slot_name === slotName);

  const isActive = (slotName: string): boolean => {
    const slot = getSlot(slotName);
    return !!(slot && slot.is_enabled && slot.ad_key);
  };

  return { slots, loading, getSlot, isActive };
}

// Invalidate cache (for admin updates)
export function invalidateAdCache() {
  cachedSlots = null;
  cacheTime = 0;
}
