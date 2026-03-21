import { X } from "lucide-react";
import { Movie, getTitle } from "@/lib/tmdb";

interface PlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function PlayerModal({ movie, onClose }: PlayerModalProps) {
  if (!movie) return null;

  const type = movie.media_type || "movie";
  const embedUrl = type === "tv"
    ? `https://vidsrc.cc/v2/embed/tv/${movie.id}/1/1`
    : `https://vidsrc.cc/v2/embed/movie/${movie.id}`;

  return (
    <div className="fixed inset-0 z-[10000] bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 glass-bg border-b border-border">
        <h3 className="text-lg font-bold truncate">{getTitle(movie)}</h3>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-foreground/10 border border-border flex items-center justify-center hover:bg-foreground/15 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 relative">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-none"
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen"
          title={getTitle(movie)}
        />
      </div>
    </div>
  );
}
