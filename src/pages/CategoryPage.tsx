import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdb, Movie, getTitle, IMG_W500 } from "@/lib/tmdb";
import { trackPageView } from "@/lib/analytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlayerModal from "@/components/PlayerModal";
import AdSlotBanner from "@/components/AdBanner";
import { Play } from "lucide-react";

const CATEGORIES: Record<string, { title: string; seoTitle: string; seoDesc: string; fetcher: () => Promise<any> }> = {
  "bangla-movie": {
    title: "🇧🇩 বাংলা সিনেমা",
    seoTitle: "বাংলা মুভি ফ্রি দেখুন HD | CinemaFreeHub",
    seoDesc: "বাংলা মুভি ফ্রি দেখুন HD quality-তে CinemaFreeHub-এ। সেরা বাংলা সিনেমা, নতুন মুভি ২০২৬, বাংলাদেশী মুভি অনলাইন।",
    fetcher: () => tmdb.banglaMovies(),
  },
  "bangla-natok": {
    title: "🇧🇩 বাংলা নাটক ও সিরিজ",
    seoTitle: "বাংলা নাটক ফ্রি দেখুন | CinemaFreeHub",
    seoDesc: "বাংলা নাটক, সিরিজ ও ওয়েব সিরিজ ফ্রিতে দেখুন। নতুন বাংলা নাটক অনলাইন HD quality-তে।",
    fetcher: () => tmdb.banglaTv(),
  },
  "hollywood": {
    title: "🎬 Hollywood Movies",
    seoTitle: "Hollywood Movies ফ্রি দেখুন HD | CinemaFreeHub",
    seoDesc: "Hollywood movies ফ্রিতে দেখুন HD quality-তে। Latest Hollywood movies, bangla dubbed movies, action movies online free।",
    fetcher: () => tmdb.popular("movie"),
  },
  "tv-shows": {
    title: "📺 TV Shows",
    seoTitle: "TV Shows ফ্রি দেখুন HD | CinemaFreeHub",
    seoDesc: "Trending TV shows ফ্রিতে দেখুন। Best TV series, web series online free HD quality।",
    fetcher: () => tmdb.trending("tv"),
  },
  "top-rated": {
    title: "⭐ Top Rated",
    seoTitle: "Top Rated Movies ফ্রি দেখুন | CinemaFreeHub",
    seoDesc: "সেরা রেটিং পাওয়া মুভি ফ্রিতে দেখুন HD quality-তে। Best movies of all time।",
    fetcher: () => tmdb.topRated("movie"),
  },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [playerMovie, setPlayerMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  const cat = CATEGORIES[category || ""] || CATEGORIES["hollywood"];

  useEffect(() => {
    trackPageView(`/category/${category}`);
    document.title = cat.seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", cat.seoDesc);

    setLoading(true);
    cat.fetcher().then((d) => {
      if (d?.results) setMovies(d.results.filter((m: Movie) => m.poster_path));
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [category]);

  const handleSearch = (q: string) => navigate(`/?q=${encodeURIComponent(q)}`);
  const goHome = () => navigate("/");

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} onHomeClick={goHome} />
      <div className="pt-[70px] px-[4%]">
        <div className="flex items-center gap-3 mt-6 mb-2">
          <button onClick={goHome} className="text-sm text-accent hover:text-foreground transition-colors">← হোম</button>
        </div>
        <h1 className="text-3xl font-black text-foreground mb-6">{cat.title}</h1>

        {/* SEO text */}
        <p className="text-foreground/50 text-sm mb-8 max-w-2xl">{cat.seoDesc}</p>

        <div className="flex justify-center mb-6">
          <AdSlotBanner slotName="banner_top" className="rounded-xl" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-12">
            {movies.map((movie) => {
              const mType = movie.media_type || "movie";
              return (
                <button
                  key={movie.id}
                  onClick={() => navigate(`/${mType}/${movie.id}`)}
                  className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-foreground/5"
                >
                  <img
                    src={`${IMG_W500}${movie.poster_path}`}
                    alt={`${getTitle(movie)} - ফ্রি মুভি দেখুন`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-3 gap-2">
                    <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 fill-primary-foreground text-primary-foreground" />
                    </div>
                    <span className="text-white text-sm font-bold text-center line-clamp-2">{getTitle(movie)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mb-8">
          <AdSlotBanner slotName="footer_above" className="rounded-xl" />
        </div>
      </div>
      <Footer />
      <PlayerModal movie={playerMovie} onClose={() => setPlayerMovie(null)} />
    </div>
  );
}
