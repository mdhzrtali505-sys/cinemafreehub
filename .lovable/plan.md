

## Google Search Console Verification যোগ করা

ইউজার Google verification ফাইল আপলোড করেছে। দুটি কাজ করতে হবে:

### 1. HTML Verification File যোগ
- `user-uploads://google93b181265d61b065.html` ফাইলটি `public/google93b181265d61b065.html` এ কপি করা
- এতে `cinemafreehub.lovable.app/google93b181265d61b065.html` এ অ্যাক্সেসযোগ্য হবে

### 2. index.html এ meta tag যোগ
- `<head>` সেকশনে `<meta name="google-site-verification" content="93b181265d61b065" />` যোগ করা

### ফাইল পরিবর্তন
| ফাইল | কাজ |
|---|---|
| `public/google93b181265d61b065.html` | verification ফাইল কপি |
| `index.html` | meta verification tag যোগ |

