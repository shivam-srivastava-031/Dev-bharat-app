import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Feed from './pages/Feed';
import Video from './pages/Video';
import Search from './pages/Search';
import Messaging from './pages/Messaging';
import Community from './pages/Community';
import AIChat from './pages/AIChat';
import Profile from './pages/Profile';

function App() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-dark-800 flex flex-col max-w-lg mx-auto relative gradient-mesh-dark">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-white/5" style={{
                background: 'rgba(15, 15, 19, 0.88)',
                backdropFilter: 'blur(24px) saturate(180%)',
            }}>
                <div className="px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="BharatApp" className="w-9 h-9 rounded-xl object-cover shadow-lg" />
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-saffron-400 to-saffron-500 text-transparent bg-clip-text">BharatApp</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-200 active:scale-95"
                            aria-label="BharatAI"
                        >
                            <span className="text-base">🤖</span>
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-200 active:scale-95" aria-label="Notifications">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-dark-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-notification" />
                        </button>
                        <button
                            className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-200 active:scale-95"
                            aria-label="Messages"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-dark-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="page-container" key={location.pathname}>
                <div className="animate-fade-in">
                    <Routes>
                        <Route path="/" element={<Navigate to="/feed" replace />} />
                        <Route path="/feed" element={<Feed />} />
                        <Route path="/video" element={<Video />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/messaging" element={<Messaging />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/ai-chat" element={<AIChat />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}

export default App;
