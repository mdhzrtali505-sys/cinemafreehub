import { useState, useEffect, useCallback } from "react";
import { Play, Info, Plus, Star, Check } from "lucide-react";
import { Movie, IMG_ORIG, getTitle, getYear, getStars } from "@/lib/tmdb";

interface HeroSliderProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
  watchlist: number[];
  onToggleWatchlist: (movie: Movie) => void;
}

export default function HeroSlider({ movies, onPlay, onInfo, watchlist, onToggleWatchlist }: HeroSliderProps) {
  const [idx, setIdx] = useState(0);
  const slides = movies.slice(0, 6);

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  if (!slides.length) return null;

  return (
    <div className="px-[4%] mb-12">
      <div className="relative w-full h-[72vh] min-h-[480px] max-h-[860px] rounded-3xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.9)]">
        <div className="flex h-full transition-transform duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {slides.map((movie, i) => {
            const type = movie.media_type || "movie";
            const inWL = watchlist.includes(movie.id);
            const stars = getStars(movie.vote_average);
            return (
              <div
                key={movie.id}
                className="min-w-full h-full relative bg-cover bg-[center_15%] bg-no-repeat"
                style={{ backgroundImage: `url(${IMG_ORIG}${movie.backdrop_path})` }}
              >
                <div className="absolute inset-0 hero-gradient-left" />
                <div className="absolute inset-0 hero-gradient-bottom" />
                <div className="absolute bottom-[10%] left-[5%] max-w-[700px] z-[2] animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  {/* Badges */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="bg-primary text-primary-foreground px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider">
                      #{i + 1} Trending
                    </span>
                    <span className="bg-foreground/10 text-foreground/80 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      {type === "movie" ? "Movie" : "TV Show"}
                    </span>
                    <span className="border border-brand-gold/50 text-brand-gold px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider">
                      4K HDR
                    </span>
                  </div>

                  <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[1.05] mb-4 text-foreground tracking-tight" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}>
                    {getTitle(movie)}
                  </h2>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-4 text-[15px] text-foreground/80 font-medium flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, si) => (
                          <Star key={si} className={`w-3 h-3 ${si < stars ? "text-brand-gold fill-brand-gold" : "text-text-tertiary"}`} />
                        ))}
                      </div>
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                    <span>{getYear(movie.release_date || movie.first_air_date)}</span>
                  </div>

                  <p className="text-[16px] text-text-secondary leading-relaxed mb-7 line-clamp-3 max-w-[580px]" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                    {movie.overview}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3.5 items-center flex-wrap">
                    <button
                      onClick={() => onPlay(movie)}
                      className="bg-foreground text-background border-none px-8 py-3.5 rounded-full text-base font-extrabold flex items-center gap-2.5 hover:bg-foreground/85 hover:scale-[1.04] active:scale-[0.97] transition-all tracking-tight"
                    >
                      <Play className="w-4 h-4 fill-background" /> Stream Now
                    </button>
                    <button
                      onClick={() => onInfo(movie)}
                      className="bg-foreground/[0.15] text-foreground border border-foreground/10 px-7 py-3.5 rounded-full text-base font-bold flex items-center gap-2.5 backdrop-blur-[10px] hover:bg-foreground/[0.25] hover:scale-[1.04] active:scale-[0.97] transition-all"
                    >
                      <Info className="w-4 h-4" /> More Info
                    </button>
                    <button
                      onClick={() => onToggleWatchlist(movie)}
                      className={`w-[50px] h-[50px] rounded-full border-2 text-foreground text-lg flex items-center justify-center backdrop-blur-[10px] hover:scale-110 active:scale-95 transition-all ${
                        inWL ? "bg-primary border-primary" : "bg-foreground/10 border-foreground/30 hover:bg-primary hover:border-primary"
                      }`}
                    >
                      {inWL ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 right-[4%] z-[2] flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-foreground" : "w-2 bg-foreground/25 hover:bg-foreground/40"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
