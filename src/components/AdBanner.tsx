import { useEffect, useRef } from "react";

interface AdBannerProps {
  adKey?: string;
  width?: number;
  height?: number;
  className?: string;
}

const ADSTERRA_ID = "a59b106c0ea0fb73099e0528d9fe7001";

export default function AdBanner({ adKey = ADSTERRA_ID, width = 728, height = 90, className = "" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    try {
      // Adsterra native banner script injection
      const atOptions = {
        key: adKey,
        format: "iframe",
        height,
        width,
        params: {},
      };

      // Set options on window
      (window as any).atOptions = atOptions;

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      script.async = true;
      containerRef.current.appendChild(script);
    } catch (e) {
      console.log("Ad blocked or failed to load");
    }
  }, [adKey, width, height]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ minHeight: height, maxWidth: "100%" }}
    />
  );
}

// Popunder ad - loads once per session
export function AdPopunder({ adKey = ADSTERRA_ID }: { adKey?: string }) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    try {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      script.async = true;
      script.dataset.cfasync = "false";
      document.head.appendChild(script);
    } catch (e) {
      console.log("Popunder ad blocked");
    }
  }, [adKey]);

  return null;
}
