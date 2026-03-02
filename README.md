# 🇮🇳 BharatApp — India's Super App

A mobile-first social super app for India, built with **React + Vite + Tailwind CSS v3 + React Router v6**. Features a social feed, short videos, messaging, community groups, and an AI chatbot powered by Claude, Sarvam AI, and Bhashini.

![Feed Screenshot](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss) ![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📰 **Feed** | Social feed with stories, post cards, filter chips (Trending, Cricket, Bollywood, Tech, Food), like/comment/share |
| 🎬 **Video** | Full-screen Reels/Shorts-style vertical video UI with creator overlays and swipe navigation |
| 💬 **Messaging** | Chat list with online indicators, unread badges, individual conversation view with call buttons |
| 👥 **Community Groups** | Category-based groups (Regional, Sports, Culture, Tech, Education, Business) with join/leave and group detail pages |
| 🤖 **BharatAI Chat** | AI chatbot with model switcher (Claude / Sarvam AI / Bhashini), Hinglish support, typing indicator, suggested queries |

### 🎨 Indian Design Theme
- **Saffron** (`#FF9933`) — Primary accent & CTAs
- **India Green** (`#138808`) — Success states & secondary
- **Navy Blue** (`#000080`) — Ashoka Chakra accent
- **Typography** — Inter + Noto Sans Devanagari
- **Effects** — Glassmorphism, gradient headers, micro-animations

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/shivam-srivastava-031/Dev-bharat-app.git
cd Dev-bharat-app

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🤖 AI Integration

BharatApp includes a built-in AI chatbot (**BharatAI**) with support for 3 providers:

| Provider | Model | Description |
|----------|-------|-------------|
| [Anthropic Claude](https://anthropic.com) | `claude-3-5-haiku` | Best-in-class reasoning with Hinglish support |
| [Sarvam AI](https://sarvam.ai) | `sarvam-2b` | India-built multilingual LLM (Hindi, Tamil, Telugu, Bengali & more) |
| [Bhashini](https://bhashini.gov.in) | ULCA Pipeline | Government of India's language AI — 22 official languages |

### Setup API Keys

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your API keys:
   ```env
   VITE_CLAUDE_API_KEY=your_anthropic_key_here
   VITE_SARVAM_API_KEY=your_sarvam_key_here
   VITE_BHASHINI_API_KEY=your_bhashini_key_here
   VITE_BHASHINI_USER_ID=your_bhashini_user_id_here
   ```
3. Restart the dev server.

> **Note:** The app works in **demo mode** without API keys — all AI responses are simulated with smart Hinglish fallbacks.

---

## 📁 Project Structure

```
bharatapp/
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx        # 5-tab bottom navigation
│   │   ├── PostCard.jsx         # Feed post card
│   │   ├── ChatBubble.jsx       # Chat message bubbles
│   │   └── ModelSwitcher.jsx    # AI provider toggle
│   ├── pages/
│   │   ├── Feed.jsx             # Social feed + stories
│   │   ├── Video.jsx            # Reels-style video player
│   │   ├── Messaging.jsx        # Chat list + conversations
│   │   ├── Community.jsx        # Community groups
│   │   └── AIChat.jsx           # BharatAI chatbot
│   ├── services/
│   │   ├── claudeService.js     # Anthropic Claude API
│   │   ├── sarvamService.js     # Sarvam AI API
│   │   └── bhashiniService.js   # Bhashini/ULCA API
│   ├── App.jsx                  # Root layout + routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── .env.example                 # API key template
├── tailwind.config.js           # Indian color palette
├── vite.config.js               # Vite configuration
└── package.json
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite 6
- **Styling:** Tailwind CSS 3 with custom Indian color tokens
- **Routing:** React Router v6
- **Fonts:** Inter + Noto Sans Devanagari (Google Fonts)
- **AI:** Anthropic Claude, Sarvam AI, Bhashini APIs

---

## 📱 Mobile-First Design

BharatApp is designed as a **mobile web app** with:
- Responsive `max-w-lg` container
- Safe-area inset padding for notch devices
- Touch-optimized tap targets
- Smooth 60fps animations
- PWA-ready viewport meta tags

---

## 📝 License

MIT License — feel free to use, modify, and distribute.

---

<p align="center">
  Made with 🧡 for Bharat 🇮🇳
</p>
