import { useState, useEffect, useCallback } from "react";
import AdSlotBanner, { RewardAdOverlay, PopunderAd } from "@/components/AdBanner";
import { Flame, TrendingUp, Sparkles, Film, Tv, Globe } from "lucide-react";
import { tmdb, Movie, getTitle } from "@/lib/tmdb";
import { trackPageView, trackMovieClick, startHeartbeat, stopHeartbeat } from "@/lib/analytics";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ContentRow from "@/components/ContentRow";
import GenreChips from "@/components/GenreChips";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import PlayerModal from "@/components/PlayerModal";
import Footer from "@/components/Footer";

interface SeeAllState {
  title: string;
  movies: Movie[];
}

export default function Index() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [tvTrending, setTvTrending] = useState<Movie[]>([]);
  const [banglaMovies, setBanglaMovies] = useState<Movie[]>([]);
  const [banglaTv, setBanglaTv] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [seeAll, setSeeAll] = useState<SeeAllState | null>(null);

  const [watchlist, setWatchlist] = useState<number[]>(() => {
    const saved = localStorage.getItem("pf_watchlist_ids");
    return saved ? JSON.parse(saved) : [];
  });

  const [modalMovie, setModalMovie] = useState<Movie | null>(null);
  const [playerMovie, setPlayerMovie] = useState<Movie | null>(null);
  const [rewardMovie, setRewardMovie] = useState<Movie | null>(null);

  useEffect(() => {
    trackPageView("/");
    startHeartbeat("/");
    return () => stopHeartbeat();
  }, []);

  useEffect(() => {
    Promise.all([
      tmdb.trending("movie").then((d) => d?.results && setTrending(d.results.filter((m) => m.backdrop_path))),
      tmdb.popular("movie").then((d) => d?.results && setPopular(d.results.filter((m) => m.poster_path))),
      tmdb.topRated("movie").then((d) => d?.results && setTopRated(d.results.filter((m) => m.poster_path))),
      tmdb.nowPlaying().then((d) => d?.results && setNowPlaying(d.results.filter((m) => m.poster_path))),
      tmdb.upcoming().then((d) => d?.results && setUpcoming(d.results.filter((m) => m.poster_path))),
      tmdb.trending("tv").then((d) => d?.results && setTvTrending(d.results.filter((m) => m.poster_path))),
      tmdb.banglaMovies().then((d) => d?.results && setBanglaMovies(d.results.filter((m) => m.poster_path))),
      tmdb.banglaTv().then((d) => d?.results && setBanglaTv(d.results.filter((m) => m.poster_path))),
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
    setSeeAll(null);
    const data = await tmdb.search(query);
    if (data?.results) {
      setSearchResults(data.results.filter((m) => m.poster_path && (m.media_type === "movie" || m.media_type === "tv")));
    }
  };

  const handleGenre = async (genre: string) => {
    setActiveGenre(genre);
    setSeeAll(null);
    if (!genre) {
      setGenreMovies([]);
      return;
    }
    setIsSearching(false);
    if (genre === "bangla") {
      const data = await tmdb.banglaMovies();
      if (data?.results) setGenreMovies(data.results.filter((m) => m.poster_path));
    } else {
      const data = await tmdb.discover("movie", `&with_genres=${genre}`);
      if (data?.results) setGenreMovies(data.results.filter((m) => m.poster_path));
    }
  };

  const goHome = () => {
    setIsSearching(false);
    setSearchQuery("");
    setSearchResults([]);
    setActiveGenre("");
    setGenreMovies([]);
    setSeeAll(null);
  };

  const handlePlay = (movie: Movie) => {
    trackMovieClick(movie.id, getTitle(movie), "play");
    setModalMovie(null);
    setRewardMovie(movie);
  };

  const handleRewardComplete = () => {
    if (rewardMovie) {
      setPlayerMovie(rewardMovie);
      setRewardMovie(null);
    }
  };

  const handleSeeAll = (title: string, movies: Movie[]) => {
    setSeeAll({ title, movies });
    setIsSearching(false);
    setActiveGenre("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showGrid = isSearching || (activeGenre && genreMovies.length > 0) || seeAll;
  const gridMovies = seeAll ? seeAll.movies : isSearching ? searchResults : genreMovies;
  const gridTitle = seeAll ? seeAll.title : isSearching ? `"${searchQuery}" এর জন্য ফলাফল` : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} onHomeClick={goHome} />

      <div className="pt-[70px]">
        <div className="flex justify-center my-3 px-[4%]">
          <AdSlotBanner slotName="banner_top" className="rounded-xl" />
        </div>

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

        <GenreChips activeGenre={activeGenre} onSelect={handleGenre} />

        {showGrid && (
          <div className="px-[4%] mb-12">
            {gridTitle && (
              <div className="flex items-center gap-3 mb-6">
                <button onClick={goHome} className="text-sm text-accent hover:text-foreground transition-colors">← হোম</button>
                <h2 className="text-2xl font-extrabold tracking-tight">{gridTitle}</h2>
              </div>
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

        {!showGrid && (
          <div className="px-[4%]">
            <ContentRow title="🔥 Trending Now" movies={trending} watchlist={watchlist} onPlay={handlePlay} onToggleWatchlist={toggleWatchlist} showRank onSeeAll={() => handleSeeAll("🔥 Trending Now", trending)} />
            <div className="flex justify-center my-6">
              <AdSlotBanner slotName="between_rows_1" className="rounded-xl" />
            </div>
            <ContentRow title="🎬 Now Playing" icon={<Film className="w-5 h-5 text-primary" />} movies={nowPlaying} watchlist={watchlist} onPlay={handlePlay} onToggleWatchlist={toggleWatchlist} onSeeAll={() => handleSeeAll("🎬 Now Playing", nowPlaying)} />
            <ContentRow title="⭐ Top Rated" icon={<TrendingUp className="w-5 h-5 text-primary" />} movies={topRated} watchlist={watchlist} onPlay={handlePlay} onToggleWatchlist={toggleWatchlist} onSeeAll={() => handleSeeAll("⭐ Top Rated", topRated)} />
            <div className="flex justify-center my-6">
              <AdSlotBanner slotName="between_rows_2" className="rounded-xl" />
            </div>
            <ContentRow title="🇧🇩 বাংলা সিনেমা" movies={banglaMovies} watchlist={watchlist} onPlay={handlePlay} onToggleWatchlist={toggleWatchlist} onSeeAll={() => handleSeeAll("🇧🇩 বাংলা সিনেমা", banglaMovies)} />
            <ContentRow title="🇧🇩 বাংলা নাটক/সিরিজ" icon={<Tv className="w-5 h-5 text-primary" />} movies={banglaTv} watchlist={watchlist} onPlay={handlePlay} onToggleWatchlist={toggleWatchlist} onSeeAll={() => handleSeeAll("🇧🇩 বাংলা নাটক/সিরিজ", banglaTv)} />
            <div className="flex justify-center my-6">
              <AdSlotBanner slotName="between_rows_3" className="rounded-xl" />
            </div>
            <ContentRow title="📺 Trending TV Shows" icon={<Tv className="w-5 h-5 text-primary" />} movies={tvTrending} watchlist={watchlist} onPlay={handlePlay} onToggleWatchlist={toggleWatchlist} onSeeAll={() => handleSeeAll("📺 Trending TV Shows", tvTrending)} />
            <ContentRow title="🍿 Popular Movies" icon={<Sparkles className="w-5 h-5 text-primary" />} movies={popular} watchlist={watchlist} onPlay={handlePlay} onToggleWatchlist={toggleWatchlist} onSeeAll={() => handleSeeAll("🍿 Popular Movies", popular)} />
            <ContentRow title="🎥 Upcoming" icon={<Globe className="w-5 h-5 text-primary" />} movies={upcoming} watchlist={watchlist} onPlay={handlePlay} onToggleWatchlist={toggleWatchlist} onSeeAll={() => handleSeeAll("🎥 Upcoming", upcoming)} />
          </div>
        )}
      </div>

      <div className="flex justify-center my-6 px-[4%]">
        <AdSlotBanner slotName="footer_above" className="rounded-xl" />
      </div>

      <Footer />
      <PopunderAd />

      {rewardMovie && (
        <RewardAdOverlay
          onComplete={handleRewardComplete}
          onSkip={handleRewardComplete}
        />
      )}

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
