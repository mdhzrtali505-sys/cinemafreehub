

## পরিকল্পনা: See All ফিক্স + বাংলা সেকশন + ব্র্যান্ড রিনেম + ডাউনলোড ব্লক

### অ্যাডমিন প্যানেল অ্যাক্সেস
আপনার ডোমেইনের পরে `/pf-ctrl-9x7k` যোগ করুন:
```
cinemafreehub.lovable.app/pf-ctrl-9x7k
```

### সাইটের নাম
আপনার ডোমেইন `cinemafreehub` — তাই সাইটের নাম **CinemaFreeHub** রাখলে SEO তে সবচেয়ে ভালো কাজ করবে।

---

### পরিবর্তনসমূহ

#### 1. ব্র্যান্ড নাম "Playflix" → "CinemaFreeHub"
- `Navbar.tsx` — লোগো টেক্সট পরিবর্তন
- `Footer.tsx` — ফুটার ব্র্যান্ড নাম পরিবর্তন
- `index.html` — মেটা ট্যাগ, OG ট্যাগ, JSON-LD সব আপডেট

#### 2. "See All" বাটন কার্যকর করা
- `ContentRow.tsx` — `onSeeAll` callback prop যোগ করা, "See All" বাটনে onClick যুক্ত
- `Index.tsx` — `seeAllCategory` state যোগ করা; See All ক্লিক করলে ঐ ক্যাটাগরির মুভি গ্রিড ভিউতে দেখানো

#### 3. বাংলা কন্টেন্ট সেকশন
- `tmdb.ts` — `discoverBangla` ফাংশন যোগ: `with_original_language=bn` ব্যবহার করে বাংলা মুভি ও টিভি ফেচ
- `Index.tsx` — দুটি নতুন ContentRow: "🇧🇩 বাংলা সিনেমা" এবং "🇧🇩 বাংলা নাটক/সিরিজ"
- `GenreChips.tsx` — "🇧🇩 Bangla" চিপ যোগ

#### 4. ডাউনলোড ব্লক (PlayerModal)
- `PlayerModal.tsx` — iframe এ `sandbox="allow-scripts allow-same-origin allow-presentation"` যোগ
- iframe এর উপরে transparent overlay div রাখা যাতে right-click কাজ না করে
- CSS `user-select: none` এবং context menu disable

### ফাইল পরিবর্তন তালিকা
| ফাইল | কাজ |
|---|---|
| `src/components/Navbar.tsx` | নাম CinemaFreeHub |
| `src/components/Footer.tsx` | নাম CinemaFreeHub |
| `index.html` | SEO মেটা ট্যাগ আপডেট |
| `src/components/ContentRow.tsx` | onSeeAll prop যোগ |
| `src/pages/Index.tsx` | See All লজিক + বাংলা সেকশন |
| `src/lib/tmdb.ts` | discoverBangla ফাংশন |
| `src/components/GenreChips.tsx` | Bangla চিপ |
| `src/components/PlayerModal.tsx` | ডাউনলোড ব্লক |

