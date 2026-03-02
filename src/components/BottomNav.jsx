import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
    {
        path: '/feed',
        label: 'Feed',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
    },
    {
        path: '/video',
        label: 'Video',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        path: '/messaging',
        label: 'Messages',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
    },
    {
        path: '/community',
        label: 'Groups',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        path: '/ai-chat',
        label: 'BharatAI',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bottom-nav glass border-t border-gray-200/50 shadow-[0_-2px_20px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-around max-w-lg mx-auto h-16">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 transition-all duration-200 group"
                            aria-label={tab.label}
                        >
                            <div
                                className={`p-1.5 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-saffron-500/15 text-saffron-500 scale-110'
                                        : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                            >
                                {tab.icon}
                            </div>
                            <span
                                className={`text-[10px] font-medium transition-colors ${isActive ? 'text-saffron-600' : 'text-gray-400'
                                    }`}
                            >
                                {tab.label}
                            </span>
                            {isActive && (
                                <div className="w-1 h-1 rounded-full bg-saffron-500 mt-0.5 animate-bounce-in" />
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
