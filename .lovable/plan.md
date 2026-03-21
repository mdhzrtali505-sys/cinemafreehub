

## পরিকল্পনা: মুভি ডাউনলোড অপশন ব্লক করা

### সমস্যা
ভিডিও প্লেয়ারের iframe-এ ডাউনলোড অপশন থাকতে পারে। এটি বন্ধ করতে হবে।

### পরিবর্তন

#### 1. `src/components/PlayerModal.tsx`
- iframe এর `sandbox` attribute যোগ করা: `sandbox="allow-scripts allow-same-origin allow-presentation"` — এটি ডাউনলোড ও অন্যান্য অবাঞ্ছিত আচরণ সীমিত করবে
- `allow` attribute থেকে অপ্রয়োজনীয় permissions সরানো
- Right-click disable করার জন্য iframe এর উপরে একটি transparent overlay div রাখা যাতে ইউজার right-click করে "Save video as" অপশন না পায়
- CSS দিয়ে `-webkit-touch-callout: none` এবং `pointer-events` কন্ট্রোল করা

#### 2. `index.html` (optional)
- গ্লোবাল right-click context menu disable করার জন্য একটি ছোট স্ক্রিপ্ট যোগ করা (শুধু ভিডিও এলিমেন্টের জন্য)

### টেকনিক্যাল ডিটেইল
- যেহেতু ভিডিও একটি third-party embed (vidsrc.cc), iframe-এর ভেতরের কন্টেন্ট সরাসরি কন্ট্রোল করা যায় না
- তবে sandbox attribute এবং overlay div দিয়ে ডাউনলোড অপশন কার্যকরভাবে ব্লক করা সম্ভব
- **নোট:** ১০০% ডাউনলোড প্রতিরোধ করা সম্ভব না (determined user always finds a way), কিন্তু সাধারণ ইউজারদের জন্য এটি যথেষ্ট

