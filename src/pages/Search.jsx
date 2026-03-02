import { useState } from 'react';

const trendingTopics = [
    { id: 1, tag: '#IPL2026', posts: '2.3M posts', emoji: '🏏', gradient: 'from-blue-500 to-indigo-600' },
    { id: 2, tag: '#DiwaliVibes', posts: '1.8M posts', emoji: '🪔', gradient: 'from-orange-500 to-amber-600' },
    { id: 3, tag: '#Bollywood', posts: '1.2M posts', emoji: '🎬', gradient: 'from-pink-500 to-rose-600' },
    { id: 4, tag: '#StartupIndia', posts: '890K posts', emoji: '🚀', gradient: 'from-green-500 to-emerald-600' },
    { id: 5, tag: '#IndianFood', posts: '750K posts', emoji: '🍛', gradient: 'from-amber-500 to-orange-600' },
    { id: 6, tag: '#TechIndia', posts: '620K posts', emoji: '💻', gradient: 'from-cyan-500 to-blue-600' },
];

const categories = [
    { id: 1, name: 'People', emoji: '👤', count: '120+' },
    { id: 2, name: 'Groups', emoji: '👥', count: '45' },
    { id: 3, name: 'Videos', emoji: '🎬', count: '500+' },
    { id: 4, name: 'News', emoji: '📰', count: '200+' },
    { id: 5, name: 'Music', emoji: '🎵', count: '300+' },
    { id: 6, name: 'Places', emoji: '📍', count: '80+' },
];

const recentSearches = [
    'Virat Kohli', 'Biryani recipe', 'IPL live score', 'React Native tutorial', 'Bollywood songs 2025',
];

const suggestedPeople = [
    { id: 1, name: 'Priya Sharma', handle: '@priyasharma', avatar: '👩', followers: '12.4K', verified: true },
    { id: 2, name: 'Raj Kumar', handle: '@rajkumar_dev', avatar: '👨', followers: '8.9K', verified: false },
    { id: 3, name: 'Ananya Patel', handle: '@ananya_food', avatar: '👧', followers: '34.2K', verified: true },
    { id: 4, name: 'Vikram Singh', handle: '@vikram_travels', avatar: '🧑', followers: '22.1K', verified: true },
];

export default function Search() {
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    return (
        <div className="animate-fade-in">
            {/* Search Bar */}
            <div className="px-4 py-3 sticky top-0 z-10" style={{
                background: 'rgba(15, 15, 19, 0.9)',
                backdropFilter: 'blur(20px)',
            }}>
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search BharatApp..."
                        className="w-full bg-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-saffron-500/40 border border-white/5 transition-all font-medium"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                        >
                            <span className="text-dark-300 text-xs">✕</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Categories */}
            <div className="px-4 py-3 border-b border-white/5">
                <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all active:scale-95 ${activeCategory === cat.id
                                    ? 'gradient-saffron text-white shadow-glow-saffron-sm'
                                    : 'bg-white/5 border border-white/5 text-dark-200 hover:bg-white/8'
                                }`}
                        >
                            <span className="text-lg">{cat.emoji}</span>
                            <div className="text-left">
                                <p className="text-[11px] font-bold">{cat.name}</p>
                                <p className={`text-[9px] ${activeCategory === cat.id ? 'text-white/60' : 'text-dark-400'}`}>{cat.count}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Searches */}
            <div className="px-4 py-3 border-b border-white/5">
                <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-bold text-dark-300 tracking-wider">RECENT</h3>
                    <button className="text-[10px] text-saffron-400 font-semibold">Clear All</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                        <button
                            key={search}
                            className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-dark-200 hover:bg-white/8 transition-all active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{search}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Trending */}
            <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-xs font-bold text-dark-300 tracking-wider mb-3">🔥 TRENDING IN INDIA</h3>
                <div className="space-y-2">
                    {trendingTopics.map((topic, i) => (
                        <button
                            key={topic.id}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all text-left active:scale-[0.99] stagger-item"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center text-lg shadow-md flex-shrink-0`}>
                                {topic.emoji}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-dark-50">{topic.tag}</p>
                                <p className="text-[11px] text-dark-400">{topic.posts}</p>
                            </div>
                            <span className="text-dark-500 text-xs font-bold">#{i + 1}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Suggested People */}
            <div className="px-4 py-3 pb-6">
                <h3 className="text-xs font-bold text-dark-300 tracking-wider mb-3">SUGGESTED FOR YOU</h3>
                <div className="space-y-2">
                    {suggestedPeople.map((person, i) => (
                        <div
                            key={person.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 stagger-item"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-xl shadow-md">
                                {person.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-bold text-dark-50 truncate">{person.name}</p>
                                    {person.verified && (
                                        <span className="text-[9px] bg-saffron-500/20 text-saffron-400 px-1.5 py-0.5 rounded-full font-bold">✓</span>
                                    )}
                                </div>
                                <p className="text-[11px] text-dark-400">{person.handle} · {person.followers} followers</p>
                            </div>
                            <button className="px-4 py-2 rounded-xl gradient-saffron text-white text-[11px] font-bold shadow-glow-saffron-sm active:scale-95 transition-transform">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
