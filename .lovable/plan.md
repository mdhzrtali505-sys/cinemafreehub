

## পরিকল্পনা: অ্যাডমিন প্যানেলে সাইট সেটিংস (নাম + লোগো পরিবর্তন)

### ধারণা
ডাটাবেসে একটি `site_settings` টেবিল তৈরি করা হবে যেখানে সাইটের নাম এবং লোগো URL সংরক্ষিত থাকবে। অ্যাডমিন প্যানেল থেকে এগুলো পরিবর্তন করা যাবে। Navbar ও Footer সেখান থেকে ডেটা পড়বে।

---

### পরিবর্তনসমূহ

#### 1. ডাটাবেস — `site_settings` টেবিল তৈরি
- `id`, `site_name` (text), `logo_url` (text, nullable), `updated_at`
- একটি ডিফল্ট row insert: `site_name = 'CinemaFreeHub'`
- RLS: সবাই পড়তে পারবে, শুধু admin আপডেট করতে পারবে

#### 2. Storage bucket তৈরি — `site-assets`
- লোগো ইমেজ আপলোডের জন্য
- Public read, admin-only upload

#### 3. নতুন hook — `useSiteSettings.ts`
- `site_settings` থেকে নাম ও লোগো URL ফেচ করবে
- ক্যাশ করবে যাতে বারবার query না হয়

#### 4. নতুন কম্পোনেন্ট — `AdminSiteSettings.tsx`
- সাইটের নাম এডিট করার ইনপুট
- লোগো আপলোড বাটন (ইমেজ আপলোড → storage → URL সেভ)
- বর্তমান লোগো প্রিভিউ
- Save বাটন

#### 5. অ্যাডমিন ড্যাশবোর্ড — নতুন ট্যাব যোগ
- `AdminDashboard.tsx` এ "Settings" ট্যাব যোগ (Analytics, Ads এর পাশে)
- Tab type: `"analytics" | "ads" | "settings"`

#### 6. CinemaLogo আপডেট
- `useSiteSettings` hook ব্যবহার করে ডাইনামিক নাম ও লোগো দেখাবে
- লোগো URL থাকলে কাস্টম ইমেজ দেখাবে, না থাকলে ডিফল্ট SVG

### ফাইল তালিকা

| ফাইল | কাজ |
|---|---|
| DB Migration | `site_settings` টেবিল + storage bucket |
| `src/hooks/useSiteSettings.ts` | সাইট সেটিংস ফেচ hook |
| `src/components/AdminSiteSettings.tsx` | সেটিংস UI (নাম + লোগো আপলোড) |
| `src/pages/AdminDashboard.tsx` | "Settings" ট্যাব যোগ |
| `src/components/CinemaLogo.tsx` | ডাইনামিক নাম ও লোগো |

