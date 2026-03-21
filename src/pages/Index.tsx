import { useState, useEffect, useCallback } from "react";
import { Flame, TrendingUp, Sparkles, Film, Tv, Globe } from "lucide-react";
import { tmdb, Movie } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ContentRow from "@/components/ContentRow";
import GenreChips from "@/components/GenreChips";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import PlayerModal from "@/components/PlayerModal";
import Footer from "@/components/Footer";

export default function Index() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [tvTrending, setTvTrending] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);

  const [watchlist, setWatchlist] = useState<number[]>(() => {
    const saved = localStorage.getItem("pf_watchlist_ids");
    return saved ? JSON.parse(saved) : [];
  });

  const [modalMovie, setModalMovie] = useState<Movie | null>(null);
  const [playerMovie, setPlayerMovie] = useState<Movie | null>(null);

  useEffect(() => {
    Promise.all([
      tmdb.trending("movie").then((d) => d?.results && setTrending(d.results.filter((m) => m.backdrop_path))),
      tmdb.popular("movie").then((d) => d?.results && setPopular(d.results.filter((m) => m.poster_path))),
      tmdb.topRated("movie").then((d) => d?.results && setTopRated(d.results.filter((m) => m.poster_path))),
      tmdb.nowPlaying().then((d) => d?.results && setNowPlaying(d.results.filter((m) => m.poster_path))),
      tmdb.upcoming().then((d) => d?.results && setUpcoming(d.results.filter((m) => m.poster_path))),
      tmdb.trending("tv").then((d) => d?.results && setTvTrending(d.results.filter((m) => m.poster_path))),
    ]);
  }, []);

  const toggleWatchlist = useCallback((movie: Movie) => {
    setWatchlist((prev) => {
      const next = prev.includes(movie.id) ? prev.filter((id) => id !== movie.id) : [...prev, movie.id];
      localStorage.setItem("pf_watchlist_ids", JSON.stringify(next));
      return next;
    });
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setActiveGenre("");
    const data = await tmdb.search(query);
    if (data?.results) {
      setSearchResults(data.results.filter((m) => m.poster_path && (m.media_type === "movie" || m.media_type === "tv")));
    }
  };

  const handleGenre = async (genre: string) => {
    setActiveGenre(genre);
    if (!genre) {
      setGenreMovies([]);
      return;
    }
    setIsSearching(false);
    const data = await tmdb.discover("movie", `&with_genres=${genre}`);
    if (data?.results) setGenreMovies(data.results.filter((m) => m.poster_path));
  };

  const goHome = () => {
    setIsSearching(false);
    setSearchQuery("");
    setSearchResults([]);
    setActiveGenre("");
    setGenreMovies([]);
  };

  const handlePlay = (movie: Movie) => {
    setModalMovie(null);
    setPlayerMovie(movie);
  };

  const showGrid = isSearching || (activeGenre && genreMovies.length > 0);
  const gridMovies = isSearching ? searchResults : genreMovies;
  const gridTitle = isSearching ? `"${searchQuery}" এর জন্য ফলাফল` : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} onHomeClick={goHome} />

      <div className="pt-[70px]">
        {/* Hero */}
        {!showGrid && (
          <div className="mt-5">
            <HeroSlider
              movies={trending}
              onPlay={handlePlay}
              onInfo={setModalMovie}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
            />
          </div>
        )}

        {/* Genre chips */}
        <GenreChips activeGenre={activeGenre} onSelect={handleGenre} />

        {/* Grid view for search/genre */}
        {showGrid && (
          <div className="px-[4%] mb-12">
            {gridTitle && (
              <h2 className="text-2xl font-extrabold mb-6 tracking-tight">{gridTitle}</h2>
            )}
            {gridMovies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-text-tertiary">
                <div className="text-5xl mb-4">👻</div>
                <div className="text-xl font-bold mb-2">কোনো ফলাফল পাওয়া যায়নি</div>
                <div className="text-sm">অন্য কিছু সার্চ করুন</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                {gridMovies.map((movie, i) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    rank={i < 3 ? i + 1 : undefined}
                    inWatchlist={watchlist.includes(movie.id)}
                    onPlay={handlePlay}
                    onToggleWatchlist={toggleWatchlist}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Home rows */}
        {!showGrid && (
          <div className="px-[4%]">
            <ContentRow
              title="🔥 Trending Now"
              movies={trending}
              watchlist={watchlist}
              onPlay={handlePlay}
              onToggleWatchlist={toggleWatchlist}
              showRank
            />
            <ContentRow
              title="🎬 Now Playing"
              icon={<Film className="w-5 h-5 text-primary" />}
              movies={nowPlaying}
              watchlist={watchlist}
              onPlay={handlePlay}
              onToggleWatchlist={toggleWatchlist}
            />
            <ContentRow
              title="⭐ Top Rated"
              icon={<TrendingUp className="w-5 h-5 text-primary" />}
              movies={topRated}
              watchlist={watchlist}
              onPlay={handlePlay}
              onToggleWatchlist={toggleWatchlist}
            />
            <ContentRow
              title="📺 Trending TV Shows"
              icon={<Tv className="w-5 h-5 text-primary" />}
              movies={tvTrending}
              watchlist={watchlist}
              onPlay={handlePlay}
              onToggleWatchlist={toggleWatchlist}
            />
            <ContentRow
              title="🍿 Popular Movies"
              icon={<Sparkles className="w-5 h-5 text-primary" />}
              movies={popular}
              watchlist={watchlist}
              onPlay={handlePlay}
              onToggleWatchlist={toggleWatchlist}
            />
            <ContentRow
              title="🎥 Upcoming"
              icon={<Globe className="w-5 h-5 text-primary" />}
              movies={upcoming}
              watchlist={watchlist}
              onPlay={handlePlay}
              onToggleWatchlist={toggleWatchlist}
            />
          </div>
        )}
      </div>

      <Footer />

      {/* Modals */}
      <MovieModal
        movie={modalMovie}
        onClose={() => setModalMovie(null)}
        inWatchlist={modalMovie ? watchlist.includes(modalMovie.id) : false}
        onToggleWatchlist={toggleWatchlist}
        onPlay={handlePlay}
      />
      <PlayerModal
        movie={playerMovie}
        onClose={() => setPlayerMovie(null)}
      />
    </div>
  );
}
