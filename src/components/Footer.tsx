import { Link } from "react-router-dom";
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
                <li><Link to="/category/hollywood" className="hover:text-foreground transition-colors">Hollywood Movies ফ্রি</Link></li>
                <li><Link to="/category/top-rated" className="hover:text-foreground transition-colors">Top Rated Movies</Link></li>
                <li><Link to="/category/tv-shows" className="hover:text-foreground transition-colors">TV Shows ফ্রি দেখুন</Link></li>
                <li><Link to="/category/bangla-movie" className="hover:text-foreground transition-colors">বাংলা মুভি ফ্রি দেখুন</Link></li>
                <li><Link to="/category/bangla-natok" className="hover:text-foreground transition-colors">বাংলা নাটক ও সিরিজ</Link></li>
              </ul>
            </nav>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-3">জনপ্রিয় কীওয়ার্ড</h3>
            <nav aria-label="SEO keywords">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li><span>HD মুভি অনলাইন ২০২৬</span></li>
                <li><span>Hollywood bangla dubbed</span></li>
                <li><span>নতুন মুভি ডাউনলোড</span></li>
                <li><span>বাংলা সিনেমা অনলাইন</span></li>
                <li><span>Free movie streaming HD</span></li>
              </ul>
            </nav>
          </section>

          <section className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold text-foreground mb-3">CinemaFreeHub সম্পর্কে</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CinemaFreeHub-এ বাংলা, হিন্দি ও Hollywood মুভি এবং TV shows সম্পূর্ণ ফ্রিতে HD quality-তে দেখুন। 
              বাংলা মুভি ফ্রি দেখুন, নতুন মুভি ২০২৬, Hollywood bangla dubbed মুভি — সবকিছু এক জায়গায়। 
              কোনো সাবস্ক্রিপশন ছাড়াই আনলিমিটেড এন্টারটেইনমেন্ট উপভোগ করুন।
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
