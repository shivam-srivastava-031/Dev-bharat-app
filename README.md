# 🇮🇳 BharatApp — India's Super App

A mobile-first social super app for India, built with **React + Vite**. Features a social feed with AI-powered ranking, short videos, real-time cricket, news, weather, messaging, community groups, and an AI chatbot.

![React](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite) ![Supabase](https://img.shields.io/badge/Supabase-DB+Auth-3ECF8E?logo=supabase) ![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 📁 Monorepo Structure

This project has been restructured into a monorepo format to cleanly separate the client application from the backend infrastructure.

### `frontend/`
Contains the entire React + Vite application, UI components, state management, PWA configuration, and Capacitor native builds (Android/iOS).

**To run the app locally:**
```bash
cd frontend
npm install
npm run dev
```
> 👉 **[View Frontend Documentation](./frontend/README.md)**

### `backend/`
Contains the Supabase Edge Functions (e.g., the secure, server-side feed ranking algorithm).

**To deploy the backend functions:**
```bash
cd backend
supabase functions deploy rank-feed
```

---

## 🚀 Quick Start

1. Clone the repository.
2. Navigate to the frontend: `cd frontend`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

The app works entirely in **demo mode** out-of-the-box (no API keys required). To enable real data, copy `frontend/.env.example` to `frontend/.env` and add your keys for Supabase, Firebase, YouTube, etc.

---

<p align="center">
  Made with 🧡 for Bharat 🇮🇳
</p>
