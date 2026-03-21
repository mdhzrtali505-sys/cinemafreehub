import { ChevronRight } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface ContentRowProps {
  title: string;
  icon?: React.ReactNode;
  movies: Movie[];
  watchlist: number[];
  onPlay: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  showRank?: boolean;
  onSeeAll?: () => void;
}

export default function ContentRow({ title, icon, movies, watchlist, onPlay, onToggleWatchlist, showRank, onSeeAll }: ContentRowProps) {
  if (!movies.length) return <RowSkeleton title={title} />;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-5 px-1">
        <h2 className="text-xl font-extrabold flex items-center gap-2.5 tracking-tight">
          {icon}
          {title}
        </h3>
        <button onClick={onSeeAll} className="text-[13px] font-bold text-accent flex items-center gap-1 hover:text-foreground hover:gap-2 transition-all">
          See All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar">
        {movies.map((movie, i) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            rank={showRank ? i + 1 : undefined}
            inWatchlist={watchlist.includes(movie.id)}
            onPlay={onPlay}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </div>
  );
}

function RowSkeleton({ title }: { title: string }) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-extrabold mb-5 px-1 tracking-tight">{title}</h3>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[155px] aspect-[2/3] rounded-[10px] bg-surface2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
