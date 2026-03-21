

## SEO উন্নতি পরিকল্পনা

বর্তমানে আপনার সাইটে বেসিক SEO আছে। নিচের উন্নতিগুলো করলে Google র‍্যাঙ্কিং অনেক ভালো হবে:

---

### 1. sitemap.xml আপডেট (ফুল URL + lastmod)
বর্তমানে sitemap এ শুধু `/` আছে এবং URL অসম্পূর্ণ। ফুল URL সহ আরো পেজ যোগ করা হবে।

### 2. robots.txt আপডেট
Sitemap এ ফুল URL দেওয়া হবে: `https://cinemafreehub.lovable.app/sitemap.xml`

### 3. index.html — উন্নত SEO ট্যাগ যোগ
- `og:url` এবং `og:image` যোগ (OG image ছাড়া সোশ্যাল শেয়ারে ইমেজ দেখায় না)
- `twitter:image` যোগ
- `theme-color` meta tag
- `lang="en"` ঠিক আছে, `hreflang` alternate tag যোগ (বাংলা কন্টেন্টের জন্য)
- আরো কীওয়ার্ড যোগ: "free streaming", "watch movies online free", "Bangla movies online"

### 4. Footer এ SEO-friendly কন্টেন্ট
- Footer এ সেকশন যোগ: "Popular Categories", "About CinemaFreeHub" — Google crawl করলে আরো keyword-rich কন্টেন্ট পাবে
- Semantic HTML ব্যবহার (`<nav>`, `<section>`, `<article>`)

### 5. Heading Structure (h1, h2) ঠিক করা
- প্রতিটি ContentRow title কে `<h2>` tag এ রাখা (বর্তমানে সম্ভবত `<div>` বা `<span>`)
- Hero section এ একটি `<h1>` tag নিশ্চিত করা

---

### ফাইল পরিবর্তন তালিকা

| ফাইল | কাজ |
|---|---|
| `public/sitemap.xml` | ফুল URL, lastmod তারিখ যোগ |
| `public/robots.txt` | ফুল sitemap URL |
| `index.html` | og:url, og:image, twitter:image, theme-color, hreflang, আরো keywords |
| `src/components/Footer.tsx` | SEO-rich ফুটার: ক্যাটাগরি লিংক, about টেক্সট |
| `src/components/ContentRow.tsx` | title কে `<h2>` semantic tag এ রাখা |
| `src/components/HeroSlider.tsx` | `<h1>` tag নিশ্চিত করা |

