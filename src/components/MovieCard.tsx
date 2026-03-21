import { Play, Heart, Star, Check } from "lucide-react";
import { Movie, IMG_W500, getTitle, getYear } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  inWatchlist?: boolean;
  onPlay: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
}

export default function MovieCard({ movie, rank, inWatchlist, onPlay, onToggleWatchlist }: MovieCardProps) {
  const type = movie.media_type || "movie";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "NR";

  return (
    <div
      className="flex-shrink-0 w-[155px] cursor-pointer card-hover-lift rounded-[10px] overflow-hidden relative group"
      onClick={() => onPlay(movie)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={IMG_W500 + movie.poster_path}
          alt={getTitle(movie)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />

        {rank !== undefined && (
          <span className="absolute top-2 left-2 z-[3] bg-primary text-primary-foreground rounded-md text-[11px] font-black px-1.5 py-0.5 tracking-wide">
            #{rank}
          </span>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2.5">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWatchlist(movie); }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${inWatchlist ? "bg-primary" : "bg-foreground/20 hover:bg-primary"}`}
            >
              {inWatchlist ? <Check className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
            </button>
            <span className="flex items-center gap-1 text-[11px] font-semibold">
              <Star className="w-3 h-3 text-brand-gold fill-brand-gold" /> {rating}
            </span>
          </div>
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center brand-glow transform scale-[0.7] opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 mb-2 mx-auto">
            <Play className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
          <div className="text-xs font-bold truncate">{getTitle(movie)}</div>
          <div className="text-[11px] text-text-secondary mt-0.5">{getYear(movie.release_date || movie.first_air_date)} · {type.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}
