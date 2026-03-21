import { Play } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16 pt-12 pb-8 px-[4%]">
      <div className="max-w-[1640px] mx-auto">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center brand-glow">
            <Play className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
          <span className="text-xl font-black text-primary tracking-tight">CinemaFreeHub</span>
        </div>
        <p className="text-text-tertiary text-sm max-w-md leading-relaxed mb-8">
          Stream your favorite movies and TV shows in HD quality. Unlimited entertainment at your fingertips.
        </p>
        <div className="text-text-tertiary text-xs">
          © {new Date().getFullYear()} CinemaFreeHub. All rights reserved. This product uses the TMDB API but is not endorsed or certified by TMDB.
        </div>
      </div>
    </footer>
  );
}
