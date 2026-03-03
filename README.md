# 🇮🇳 BharatApp — India's Super App

A mobile-first social super app for India, built with **React + Vite**. Features a social feed with AI-powered ranking, short videos, real-time cricket, news, weather, messaging, community groups, and an AI chatbot — with PWA offline support and native Android/iOS builds via Capacitor.

![React](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite) ![Supabase](https://img.shields.io/badge/Supabase-DB+Auth-3ECF8E?logo=supabase) ![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase) ![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📰 **Feed** | AI-ranked social feed with stories, filter chips (Trending, Cricket, Bollywood, Tech, Food), real Unsplash photos, like/comment/share |
| 🎬 **Reels** | Full-screen Shorts-style vertical video UI with real YouTube trending videos |
| 🔍 **Search** | Live cricket scores, trending news, weather — all from real APIs |
| 💬 **Chat** | Messaging with online indicators and unread badges |
| 👥 **Community** | Category-based groups (Regional, Sports, Culture, Tech, Education) |
| 🤖 **BharatAI** | AI chatbot with Claude / Sarvam AI / Bhashini, Hinglish support |
| 👤 **Profile** | User profile with stats, saved posts, and settings |
| 📊 **Admin** | Real-time analytics dashboard at `/admin` — A/B tests, engagement, cache stats |

### 🧠 Intelligence Layer

| Module | What it does |
|--------|-------------|
| `feedPipeline.js` | 6-stage ranking: filter → score → cold start → trending → fatigue → diversity |
| `coldStart.js` | 12-topic onboarding + 8 Indian languages, affinity seeding at +8 weight |
| `trendingBoost.js` | Velocity scoring, live cricket 1.5×, breaking news 1.4×, festival auto-detection |
| `sessionDiversity.js` | Max 3 same-topic in first 10, 1-in-5 discovery slots, fatigue multiplier |
| `eventTracker.js` | Collects likes, saves, skips, watch%, syncs to Supabase |
| `collaborativeFilter.js` | "People like you also liked..." recommendations |

### 🎨 Indian Design Theme
- **Saffron** (`#FF9933`) — Primary accent & CTAs
- **India Green** (`#138808`) — Success states
- **Navy Blue** (`#000080`) — Ashoka Chakra accent
- **Typography** — Inter + Noto Sans Devanagari
- **Effects** — Glassmorphism, gradient mesh backgrounds, micro-animations

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

> The app works in **demo mode** without any API keys — all data is simulated.

---

## 🔑 API Setup (Free Tiers)

Copy `.env.example` to `.env` and add your keys:

```env
# Supabase (DB + Storage)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Firebase (Auth)
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:android:abc123

# Data APIs
VITE_UNSPLASH_ACCESS_KEY=       # 50 req/hr  — unsplash.com/developers
VITE_YOUTUBE_API_KEY=           # 10K/day    — console.cloud.google.com
VITE_GNEWS_API_KEY=             # 100/day    — gnews.io
VITE_CRICKET_API_KEY=           # 100/day    — cricapi.com
VITE_WEATHER_API_KEY=           # 1K/day     — openweathermap.org/api
```

---

## 📁 Project Structure

```
bharatapp/
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker (offline caching)
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx       # 5-tab bottom navigation
│   │   └── PostCard.jsx        # Feed post card with "Not Interested"
│   ├── contexts/
│   │   └── AuthContext.jsx     # Firebase auth provider
│   ├── lib/
│   │   ├── firebase.js         # Firebase init
│   │   └── supabase.js         # Supabase client
│   ├── pages/
│   │   ├── Feed.jsx            # AI-ranked feed (cache-first)
│   │   ├── Video.jsx           # YouTube Reels player
│   │   ├── Search.jsx          # Cricket + News + Weather
│   │   ├── Messaging.jsx       # Chat UI
│   │   ├── Community.jsx       # Groups
│   │   ├── AIChat.jsx          # BharatAI chatbot
│   │   ├── Profile.jsx         # User profile
│   │   ├── OnboardingScreen.jsx # 2-step onboarding (topics + language)
│   │   ├── AdminDashboard.jsx  # Analytics dashboard
│   │   └── Login.jsx           # Auth screen
│   ├── services/
│   │   ├── feedPipeline.js     # 6-stage ranking pipeline
│   │   ├── coldStart.js        # Onboarding + affinity seeding
│   │   ├── trendingBoost.js    # Velocity + festival detection
│   │   ├── sessionDiversity.js # Fatigue + discovery slots
│   │   ├── eventTracker.js     # Signal collection + Supabase sync
│   │   ├── collaborativeFilter.js
│   │   ├── offlineCache.js     # IndexedDB stale-while-revalidate
│   │   ├── rankingApi.js       # Edge Function proxy
│   │   ├── storage.js          # Supabase Storage
│   │   ├── unsplashService.js  # Photos API
│   │   ├── youtubeService.js   # Videos API
│   │   ├── newsService.js      # GNews API
│   │   ├── cricketService.js   # CricAPI
│   │   └── weatherService.js   # OpenWeatherMap
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Design system + animations
├── supabase/
│   └── functions/
│       └── rank-feed/index.js  # Server-side ranking (JWT auth)
├── android/                    # Capacitor Android project
├── ios/                        # Capacitor iOS project
├── capacitor.config.json       # Native app config
├── vercel.json                 # Vercel deployment config
└── .env                        # API keys (not committed)
```

---

## 📱 Deploy

### Web (Vercel)
```bash
npm i -g vercel
vercel
# Add VITE_* env vars in Vercel Dashboard → Settings → Environment Variables
```

### Android (Play Store)
```bash
npm run build
npx cap sync android
npx cap open android
# Android Studio → Build → Generate Signed Bundle → Upload to Play Console
```

### iOS (App Store)
```bash
npm run build
npx cap sync ios
npx cap open ios
# Xcode → Product → Archive → Upload to App Store Connect
```

### PWA (Installable)
Users can install directly from the browser:
- **Android:** Chrome shows "Add to Home Screen" banner
- **iOS:** Safari → Share → "Add to Home Screen"

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6 |
| Auth | Firebase Auth, Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (1GB free) |
| Edge Functions | Supabase (Deno) — server-side ranking |
| Offline | IndexedDB + Service Worker |
| Native | Capacitor (Android + iOS) |
| APIs | Unsplash, YouTube, GNews, CricAPI, OpenWeatherMap |
| AI | Anthropic Claude, Sarvam AI, Bhashini |
| Deploy | Vercel (web), Play Store, App Store |

---

## 📝 License

MIT License — feel free to use, modify, and distribute.

---

<p align="center">
  Made with 🧡 for Bharat 🇮🇳
</p>
