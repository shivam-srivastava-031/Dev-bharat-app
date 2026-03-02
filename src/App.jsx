import { Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Feed from './pages/Feed';
import Video from './pages/Video';
import Messaging from './pages/Messaging';
import Community from './pages/Community';
import AIChat from './pages/AIChat';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto relative">
            {/* Header */}
            <header className="gradient-indian-header text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                        🇮🇳
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">BharatApp</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors" aria-label="Notifications">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="page-container">
                <Routes>
                    <Route path="/" element={<Navigate to="/feed" replace />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/video" element={<Video />} />
                    <Route path="/messaging" element={<Messaging />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/ai-chat" element={<AIChat />} />
                </Routes>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}

export default App;
