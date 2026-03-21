import { useEffect, useState } from "react";
import { X, Play, Plus, Check, Star, Clock, Calendar } from "lucide-react";
import { Movie, tmdb, IMG_ORIG, getTitle, getYear, getStars } from "@/lib/tmdb";

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  inWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

export default function MovieModal({ movie, onClose, inWatchlist, onToggleWatchlist, onPlay }: MovieModalProps) {
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!movie) return;
    const type = movie.media_type || "movie";
    (type === "movie" ? tmdb.movieDetails(movie.id) : tmdb.tvDetails(movie.id)).then(setDetails);
  }, [movie]);

  if (!movie) return null;

  const stars = getStars(movie.vote_average);
  const genres = details?.genres?.map((g: any) => g.name) || [];
  const trailer = details?.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-card rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.9)] border border-border animate-fade-up max-h-[90vh] overflow-y-auto"
      >
        {/* Backdrop */}
        <div className="relative h-[340px] bg-cover bg-center" style={{ backgroundImage: `url(${IMG_ORIG}${movie.backdrop_path})` }}>
          <div className="absolute inset-0 hero-gradient-bottom" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full glass-bg border border-border flex items-center justify-center hover:bg-foreground/10 transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 -mt-20 relative z-10">
          <h2 className="text-3xl font-black mb-3 tracking-tight">{getTitle(movie)}</h2>

          <div className="flex items-center gap-4 mb-4 text-sm text-text-secondary flex-wrap">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? "text-brand-gold fill-brand-gold" : "text-text-tertiary"}`} />
              ))}
              <span className="ml-1 font-semibold text-foreground">{movie.vote_average.toFixed(1)}</span>
            </div>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{getYear(movie.release_date || movie.first_air_date)}</span>
            {details?.runtime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>}
          </div>

          {genres.length > 0 && (
            <div className="flex gap-2 mb-5 flex-wrap">
              {genres.map((g: string) => (
                <span key={g} className="bg-surface2 border border-border text-text-secondary px-3 py-1 rounded-full text-xs font-semibold">{g}</span>
              ))}
            </div>
          )}

          <p className="text-text-secondary leading-relaxed mb-6 text-pretty">{movie.overview}</p>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => onPlay(movie)}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] transition-all brand-glow"
            >
              <Play className="w-4 h-4 fill-primary-foreground" /> Play Now
            </button>
            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-foreground/10 text-foreground border border-border px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-foreground/15 transition-all"
              >
                <Play className="w-4 h-4" /> Trailer
              </a>
            )}
            <button
              onClick={() => onToggleWatchlist(movie)}
              className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 border transition-all ${inWatchlist ? "bg-primary/10 border-primary/40 text-primary" : "bg-foreground/10 border-border text-foreground hover:border-primary/40"}`}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {inWatchlist ? "In List" : "Add to List"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
