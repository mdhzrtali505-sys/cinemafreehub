import { useEffect, useRef } from "react";
import { useAdSettings } from "@/hooks/useAdSettings";

const ADSENSE_CLIENT = "ca-pub-6614014413986916";

interface AdSlotBannerProps {
  slotName: string;
  className?: string;
}

export default function AdSlotBanner({ slotName, className = "" }: AdSlotBannerProps) {
  const { getSlot, isActive } = useAdSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  const slot = getSlot(slotName);
  const active = isActive(slotName);

  useEffect(() => {
    if (loaded.current || !containerRef.current || !active || !slot) return;
    loaded.current = true;

    try {
      const ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", ADSENSE_CLIENT);
      ins.setAttribute("data-ad-slot", slot.ad_key);

      switch (slot.ad_type) {
        case "in-feed":
          ins.setAttribute("data-ad-format", "fluid");
          if (slot.layout_key) {
            ins.setAttribute("data-ad-layout-key", slot.layout_key);
          }
          break;
        case "in-article":
          ins.setAttribute("data-ad-format", "fluid");
          ins.setAttribute("data-ad-layout", "in-article");
          ins.style.textAlign = "center";
          break;
        case "multiplex":
          ins.setAttribute("data-ad-format", "autorelaxed");
          break;
        case "display":
        case "responsive":
        default:
          ins.setAttribute("data-ad-format", "auto");
          ins.setAttribute("data-full-width-responsive", "true");
          break;
      }

      // For fixed size ads
      if (slot.ad_type === "banner" && slot.width && slot.height) {
        ins.style.width = `${slot.width}px`;
        ins.style.height = `${slot.height}px`;
      }

      containerRef.current.appendChild(ins);
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      console.log("Ad blocked or failed");
    }
  }, [active, slot]);

  if (!active || !slot) return null;

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        minHeight: slot.ad_type === "banner" ? slot.height : 90,
        maxWidth: "100%",
      }}
    />
  );
}

// Reward ad overlay shown before playing
interface RewardAdOverlayProps {
  slotName?: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function RewardAdOverlay({ slotName = "player_reward", onComplete, onSkip }: RewardAdOverlayProps) {
  const { getSlot, isActive } = useAdSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const fallbackDone = useRef(false);
  const active = isActive(slotName);
  const slot = getSlot(slotName);

  useEffect(() => {
    if (loaded.current || !containerRef.current || !active || !slot) return;
    loaded.current = true;

    try {
      const ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", ADSENSE_CLIENT);
      ins.setAttribute("data-ad-slot", slot.ad_key);
      ins.style.width = `${slot.width}px`;
      ins.style.height = `${slot.height}px`;
      containerRef.current.appendChild(ins);
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      console.log("Reward ad blocked");
    }

    const timer = setTimeout(onComplete, 10000);
    return () => clearTimeout(timer);
  }, [active, slot, onComplete]);

  useEffect(() => {
    if (!active || !slot) {
      if (!fallbackDone.current) {
        fallbackDone.current = true;
        onComplete();
      }
      return;
    }
    fallbackDone.current = false;
  }, [active, slot, onComplete]);

  if (!active || !slot) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center gap-6 animate-fade-in">
      <div className="text-sm text-white/60 font-medium tracking-wide uppercase">
        বিজ্ঞাপন দেখুন • Ad
      </div>
      <div
        ref={containerRef}
        className="bg-black/50 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center"
        style={{ width: slot.width, height: slot.height, maxWidth: "95vw" }}
      />
      <div className="flex gap-3 mt-2">
        <button
          onClick={onSkip}
          className="px-5 py-2.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/15 transition-colors active:scale-[0.97]"
        >
          Skip Ad →
        </button>
        <button
          onClick={onComplete}
          className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-[0.97]"
        >
          ▶ Continue to Movie
        </button>
      </div>
      <CountdownTimer seconds={10} onDone={onComplete} />
    </div>
  );
}

function CountdownTimer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let remaining = seconds;
    const interval = setInterval(() => {
      remaining--;
      if (ref.current) ref.current.textContent = `${remaining}s`;
      if (remaining <= 0) {
        clearInterval(interval);
        onDone();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onDone]);

  return (
    <div ref={ref} className="text-xs text-white/40 tabular-nums">
      {seconds}s
    </div>
  );
}

// Popunder ad — no longer used with AdSense (kept for compatibility)
export function PopunderAd() {
  return null;
}
