import { useState, useEffect, useRef } from "react";
import { Search, X, Bell } from "lucide-react";
import { tmdb, IMG_W500, getTitle, Movie } from "@/lib/tmdb";
import CinemaLogo from "./CinemaLogo";

interface NavbarProps {
  onSearch: (query: string) => void;
  onHomeClick: () => void;
}

export default function Navbar({ onSearch, onHomeClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [showDrop, setShowDrop] = useState(false);
  const lastY = useRef(0);
  const debounce = useRef<ReturnType<typeof setTimeout>>();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      if (y > lastY.current + 5 && y > 200) setHidden(true);
      else if (y < lastY.current - 5) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setShowDrop(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    clearTimeout(debounce.current);
    if (val.trim().length > 2) {
      debounce.current = setTimeout(async () => {
        const data = await tmdb.search(val.trim());
        if (data?.results) {
          setResults(data.results.filter((i) => i.poster_path).slice(0, 5));
          setShowDrop(true);
        }
      }, 300);
    } else {
      setShowDrop(false);
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowDrop(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-[70px] z-[5000] flex justify-between items-center px-[4%] transition-all duration-300 ${
        scrolled ? "glass-bg border-b border-border shadow-[0_4px_40px_rgba(0,0,0,0.6)]" : "bg-gradient-to-b from-background/95 to-transparent"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-9">
        <button onClick={onHomeClick} className="flex items-center gap-2.5 text-primary font-black text-[26px] tracking-tight hover:scale-[1.04] transition-transform active:scale-[0.97]">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center brand-glow">
            <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
          <span className="hidden sm:inline" style={{ textShadow: "0 0 30px hsla(358,93%,47%,0.5)" }}>CinemaFreeHub</span>
        </button>
      </div>

      {/* Search */}
      <div ref={wrapRef} className="relative hidden md:block">
        <div className="flex items-center gap-2 bg-foreground/[0.06] border border-border rounded-full px-4 py-2.5 w-[300px] focus-within:w-[380px] focus-within:border-primary/60 focus-within:shadow-[0_0_0_3px_hsla(358,93%,47%,0.1)] transition-all duration-300 backdrop-blur-[10px]">
          <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => query.length > 2 && setShowDrop(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Search movies, shows..."
            className="bg-transparent border-none text-foreground text-sm flex-1 outline-none placeholder:text-text-tertiary"
          />
          {query && (
            <button onClick={() => { setQuery(""); setShowDrop(false); }} className="text-text-tertiary hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDrop && results.length > 0 && (
          <div className="absolute top-[calc(100%+10px)] right-0 w-full min-w-[400px] bg-surface2 border border-border rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.75)] overflow-hidden animate-fade-up">
            <div className="px-[18px] pt-3 pb-2 text-[11px] font-bold tracking-[1.5px] uppercase text-text-tertiary">Results</div>
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSearch(getTitle(item));
                  setQuery(getTitle(item));
                  setShowDrop(false);
                }}
                className="flex items-center gap-3.5 px-[18px] py-2.5 w-full text-left hover:bg-foreground/[0.04] transition-colors border-t border-border"
              >
                <img src={IMG_W500 + item.poster_path} className="w-10 h-[58px] rounded-md object-cover flex-shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{getTitle(item)}</div>
                  <div className="text-xs text-text-secondary mt-0.5 flex items-center gap-2.5">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {item.media_type || "movie"}
                    </span>
                    <span>⭐ {item.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3.5">
        <button className="md:hidden text-foreground p-1.5" onClick={() => {
          const q = prompt("Search movies...");
          if (q) onSearch(q);
        }}>
          <Search className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full bg-foreground/[0.05] border border-border text-text-secondary flex items-center justify-center hover:text-foreground hover:bg-foreground/10 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-[5px] right-[5px] w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>
      </div>
    </nav>
  );
}
