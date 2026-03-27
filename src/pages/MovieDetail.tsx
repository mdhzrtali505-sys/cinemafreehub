import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdb, Movie, getTitle, getYear, getStars, IMG_ORIG, IMG_W500 } from "@/lib/tmdb";
import { trackPageView } from "@/lib/analytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlayerModal from "@/components/PlayerModal";
import AdSlotBanner from "@/components/AdBanner";
import { Play, Star, ArrowLeft, Calendar, Clock, Globe } from "lucide-react";

interface MovieDetails extends Movie {
  runtime?: number;
  number_of_seasons?: number;
  genres?: { id: number; name: string }[];
  videos?: { results: { key: string; type: string; site: string }[] };
  tagline?: string;
  production_countries?: { name: string }[];
  spoken_languages?: { english_name: string }[];
  budget?: number;
  revenue?: number;
}

export default function MovieDetail() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [playerMovie, setPlayerMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  const mediaType = type === "tv" ? "tv" : "movie";
  const numId = Number(id);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    trackPageView(`/${type}/${id}`);

    const fetchDetails = mediaType === "tv" ? tmdb.tvDetails(numId) : tmdb.movieDetails(numId);
    
    fetchDetails.then((data) => {
      if (data) {
        setDetails({ ...data, media_type: mediaType });
        // Update page title for SEO
        document.title = `${data.title || data.name} - ফ্রিতে দেখুন HD | CinemaFreeHub`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", `${data.title || data.name} ফ্রিতে দেখুন CinemaFreeHub-এ। ${data.overview?.slice(0, 120)}`);
        }
      }
      setLoading(false);
    });

    // Fetch similar
    fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/similar?api_key=05902896074695709d7763505bb88b4d`)
      .then(r => r.json())
      .then(d => {
        if (d?.results) setSimilar(d.results.filter((m: Movie) => m.poster_path).slice(0, 12));
      });

    window.scrollTo(0, 0);
  }, [type, id, mediaType, numId]);

  const handleSearch = (query: string) => navigate(`/?q=${encodeURIComponent(query)}`);
  const goHome = () => navigate("/");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={handleSearch} onHomeClick={goHome} />
        <div className="pt-[70px] flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={handleSearch} onHomeClick={goHome} />
        <div className="pt-[70px] flex flex-col items-center justify-center h-[60vh] text-foreground/60">
          <div className="text-5xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-2">কন্টেন্ট পাওয়া যায়নি</h1>
          <button onClick={goHome} className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold">হোমে ফিরে যান</button>
        </div>
      </div>
    );
  }

  const title = getTitle(details);
  const year = getYear(details.release_date || details.first_air_date);
  const stars = getStars(details.vote_average);
  const trailer = details.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  const genres = details.genres || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} onHomeClick={goHome} />

      {/* Hero backdrop */}
      <div className="relative w-full h-[50vh] min-h-[350px]">
        {details.backdrop_path && (
          <img
            src={`${IMG_ORIG}${details.backdrop_path}`}
            alt={`${title} backdrop`}
            className="w-full h-full object-cover object-[center_20%]"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-20 left-4 z-10 bg-background/50 backdrop-blur-md p-2 rounded-full text-foreground hover:bg-background/80 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-[4%] -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {details.poster_path && (
            <div className="shrink-0">
              <img
                src={`${IMG_W500}${details.poster_path}`}
                alt={`${title} poster - বাংলা মুভি ফ্রি দেখুন`}
                className="w-[200px] md:w-[280px] rounded-2xl shadow-2xl"
                loading="eager"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 pt-4">
            <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3 tracking-tight">{title}</h1>
            
            {details.tagline && (
              <p className="text-foreground/50 italic text-lg mb-4">"{details.tagline}"</p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 mb-5 text-sm text-foreground/70 flex-wrap">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? "text-brand-gold fill-brand-gold" : "text-foreground/20"}`} />
                ))}
                <span className="ml-1 font-bold">{details.vote_average.toFixed(1)}</span>
              </div>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {year}</span>
              {details.runtime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {details.runtime} মিনিট</span>}
              {details.number_of_seasons && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {details.number_of_seasons} সিজন</span>}
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase">
                {mediaType === "tv" ? "TV Show" : "Movie"}
              </span>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-5">
                {genres.map(g => (
                  <span key={g.id} className="bg-foreground/10 text-foreground/80 px-3 py-1 rounded-full text-xs font-semibold">{g.name}</span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-foreground/80 leading-relaxed text-base mb-6 max-w-[700px]">{details.overview}</p>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap mb-6">
              <button
                onClick={() => setPlayerMovie(details)}
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-extrabold flex items-center gap-2.5 hover:opacity-90 hover:scale-[1.03] active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-primary-foreground" /> এখনই দেখুন ফ্রি
              </button>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-foreground/10 text-foreground px-7 py-3.5 rounded-full font-bold flex items-center gap-2 backdrop-blur-sm hover:bg-foreground/20 transition"
                >
                  ▶ ট্রেইলার দেখুন
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Ad */}
        <div className="flex justify-center my-8">
          <AdSlotBanner slotName="between_rows_1" className="rounded-xl" />
        </div>

        {/* SEO-rich text block */}
        <section className="my-8 max-w-3xl">
          <h2 className="text-xl font-bold text-foreground mb-3">
            {title} ফ্রিতে দেখুন HD Quality-তে
          </h2>
          <p className="text-foreground/60 text-sm leading-relaxed">
            {title} ({year}) সম্পূর্ণ ফ্রিতে দেখুন CinemaFreeHub-এ। বাংলা মুভি ফ্রি দেখুন, HD মুভি অনলাইন ২০২৬, 
            Hollywood bangla dubbed মুভি এবং নতুন মুভি সবসময় পাবেন এখানে। 
            {mediaType === "tv" ? ` ${title} সিরিজের সব এপিসোড দেখুন HD quality-তে।` : ` ${title} মুভিটি HD quality-তে উপভোগ করুন।`}
          </p>
        </section>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="my-10">
            <h2 className="text-2xl font-bold text-foreground mb-5">একই ধরনের আরো কন্টেন্ট</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {similar.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/${m.media_type || mediaType}/${m.id}`)}
                  className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-foreground/5"
                >
                  <img
                    src={`${IMG_W500}${m.poster_path}`}
                    alt={`${getTitle(m)} - ফ্রি মুভি`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-sm font-bold line-clamp-2">{getTitle(m)}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Ad */}
        <div className="flex justify-center my-8">
          <AdSlotBanner slotName="footer_above" className="rounded-xl" />
        </div>
      </div>

      <Footer />

      <PlayerModal movie={playerMovie} onClose={() => setPlayerMovie(null)} />
    </div>
  );
}
