import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
    {
        path: '/feed',
        label: 'Feed',
        icon: (active) => (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        path: '/video',
        label: 'Reels',
        icon: (active) => (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        path: '/search',
        label: 'Search',
        isCenter: true,
        icon: (active) => (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        path: '/messaging',
        label: 'Chat',
        badge: 3,
        icon: (active) => (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
    },
    {
        path: '/profile',
        label: 'Profile',
        icon: (active) => (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bottom-nav">
            <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-1">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;

                    if (tab.isCenter) {
                        return (
                            <NavLink
                                key={tab.path}
                                to={tab.path}
                                className="flex flex-col items-center justify-center -mt-5 group"
                                aria-label={tab.label}
                            >
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive
                                            ? 'gradient-saffron shadow-glow-saffron scale-110'
                                            : 'bg-gradient-to-br from-saffron-500/80 to-saffron-600/80 shadow-lg group-hover:shadow-glow-saffron-sm group-hover:scale-105'
                                        }`}
                                >
                                    <div className="text-white">{tab.icon(isActive)}</div>
                                </div>
                                <span
                                    className={`text-[9px] font-bold mt-1 transition-colors ${isActive ? 'text-saffron-400' : 'text-dark-300 group-hover:text-dark-200'
                                        }`}
                                >
                                    {tab.label}
                                </span>
                            </NavLink>
                        );
                    }

                    return (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-all duration-200 group relative"
                            aria-label={tab.label}
                        >
                            {isActive && (
                                <div className="absolute inset-0 nav-pill-active animate-scale-in" />
                            )}
                            <div
                                className={`relative p-1 rounded-xl transition-all duration-200 ${isActive
                                        ? 'text-saffron-400 scale-110'
                                        : 'text-dark-300 group-hover:text-dark-100'
                                    }`}
                            >
                                {tab.icon(isActive)}
                                {tab.badge && !isActive && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                        <span className="text-[8px] text-white font-bold">{tab.badge}</span>
                                    </span>
                                )}
                            </div>
                            <span
                                className={`text-[10px] font-medium transition-colors ${isActive ? 'text-saffron-400' : 'text-dark-400 group-hover:text-dark-200'
                                    }`}
                            >
                                {tab.label}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
