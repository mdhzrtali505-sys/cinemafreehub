import { useSiteSettings } from "@/hooks/useSiteSettings";

interface CinemaLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function CinemaLogo({ size = 36, showText = true, className = "" }: CinemaLogoProps) {
  const { settings } = useSiteSettings();
  const siteName = settings?.site_name || "CinemaFreeHub";
  const logoUrl = settings?.logo_url;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {logoUrl ? (
        <img src={logoUrl} alt={siteName} style={{ height: size, width: "auto" }} className="object-contain" />
      ) : (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="hsl(358, 93%, 52%)" />
              <stop offset="100%" stopColor="hsl(358, 93%, 38%)" />
            </linearGradient>
            <filter id="logoGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#logoGrad)" filter="url(#logoGlow)" />
          <rect x="6" y="8" width="4" height="5" rx="1.5" fill="hsl(358, 93%, 65%)" opacity="0.5" />
          <rect x="6" y="17" width="4" height="5" rx="1.5" fill="hsl(358, 93%, 65%)" opacity="0.5" />
          <rect x="6" y="26" width="4" height="5" rx="1.5" fill="hsl(358, 93%, 65%)" opacity="0.5" />
          <rect x="6" y="35" width="4" height="5" rx="1.5" fill="hsl(358, 93%, 65%)" opacity="0.5" />
          <rect x="38" y="8" width="4" height="5" rx="1.5" fill="hsl(358, 93%, 65%)" opacity="0.5" />
          <rect x="38" y="17" width="4" height="5" rx="1.5" fill="hsl(358, 93%, 65%)" opacity="0.5" />
          <rect x="38" y="26" width="4" height="5" rx="1.5" fill="hsl(358, 93%, 65%)" opacity="0.5" />
          <rect x="38" y="35" width="4" height="5" rx="1.5" fill="hsl(358, 93%, 65%)" opacity="0.5" />
          <path d="M20 14L34 24L20 34V14Z" fill="white" fillOpacity="0.95" />
        </svg>
      )}
      {showText && (
        <span className="font-black text-[22px] sm:text-[26px] tracking-tight text-primary" style={{ textShadow: "0 0 30px hsla(358,93%,47%,0.5)" }}>
          {siteName}
        </span>
      )}
    </div>
  );
}
