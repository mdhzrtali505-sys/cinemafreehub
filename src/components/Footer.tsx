import CinemaLogo from "./CinemaLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16 pt-12 pb-8 px-[4%]">
      <div className="max-w-[1640px] mx-auto">
        <div className="mb-6">
          <CinemaLogo size={32} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <section>
            <h3 className="text-sm font-bold text-foreground mb-3">Popular Categories</h3>
            <nav aria-label="Movie categories">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Trending Movies</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Top Rated Movies</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">TV Shows</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Bangla Movies & Natok</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Upcoming Movies</span></li>
              </ul>
            </nav>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-3">Genres</h3>
            <nav aria-label="Movie genres">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Action & Adventure</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Comedy</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Drama & Romance</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Horror & Thriller</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Sci-Fi & Fantasy</span></li>
              </ul>
            </nav>
          </section>

          <section className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold text-foreground mb-3">About CinemaFreeHub</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CinemaFreeHub is your free online destination to watch movies and TV shows in HD quality. 
              Stream trending Hollywood blockbusters, Bangla movies, natok, and TV series — all for free. 
              Enjoy unlimited entertainment with no subscription required.
            </p>
          </section>
        </div>

        <div className="text-muted-foreground text-xs border-t border-border pt-6">
          © {new Date().getFullYear()} CinemaFreeHub. All rights reserved. This product uses the TMDB API but is not endorsed or certified by TMDB.
        </div>
      </div>
    </footer>
  );
}
