import { useEffect, useRef } from "react";
import { useAdSettings } from "@/hooks/useAdSettings";

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
      const atOptions = {
        key: slot.ad_key,
        format: "iframe",
        height: slot.height,
        width: slot.width,
        params: {},
      };
      (window as any).atOptions = atOptions;

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.highperformanceformat.com/${slot.ad_key}/invoke.js`;
      script.async = true;
      containerRef.current.appendChild(script);
    } catch {
      console.log("Ad blocked or failed");
    }
  }, [active, slot]);

  if (!active || !slot) return null;

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ minHeight: slot.height, maxWidth: "100%" }}
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
      const atOptions = {
        key: slot.ad_key,
        format: "iframe",
        height: slot.height,
        width: slot.width,
        params: {},
      };
      (window as any).atOptions = atOptions;

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.highperformanceformat.com/${slot.ad_key}/invoke.js`;
      script.async = true;
      containerRef.current.appendChild(script);
    } catch {
      console.log("Reward ad blocked");
    }

    // Auto-skip after 10 seconds
    const timer = setTimeout(onComplete, 10000);
    return () => clearTimeout(timer);
  }, [active, slot, onComplete]);

  if (!active || !slot) {
    // If no reward ad configured, go directly to player
    onComplete();
    return null;
  }

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
