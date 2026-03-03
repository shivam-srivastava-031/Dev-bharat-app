import { useState } from 'react';

const categories = ['All', 'Regional', 'Sports', 'Culture', 'Tech', 'Education', 'Business'];

const groups = [
    {
        id: 1,
        name: 'Delhi NCR Developers',
        category: 'Tech',
        emoji: '💻',
        members: '12.4K',
        description: 'Connect with fellow developers from Delhi NCR. Code, collaborate, aur chai pe charcha! ☕',
        gradient: 'from-blue-500 to-indigo-600',
        posts: 245,
        isJoined: true,
        recentActivity: 'Amit shared a React tutorial',
        trending: false,
    },
    {
        id: 2,
        name: 'Mumbai Foodies',
        category: 'Regional',
        emoji: '🍔',
        members: '34.7K',
        description: 'Vada Pav se Biryani tak — Mumbai ka best food discover karo! 🤤',
        gradient: 'from-orange-500 to-red-600',
        posts: 1200,
        isJoined: true,
        recentActivity: 'Priya reviewed a new cafe in Bandra',
        trending: true,
    },
    {
        id: 3,
        name: 'IPL Fan Club',
        category: 'Sports',
        emoji: '🏏',
        members: '89.2K',
        description: 'IPL updates, match predictions, aur fan banter. #IPL2026 🏆',
        gradient: 'from-blue-600 to-purple-700',
        posts: 5600,
        isJoined: false,
        recentActivity: 'Live discussion: MI vs CSK!',
        trending: true,
    },
    {
        id: 4,
        name: 'Bollywood Buzz',
        category: 'Culture',
        emoji: '🎬',
        members: '56.1K',
        description: 'Latest Bollywood gossip, reviews, aur filmy memes! 🌟',
        gradient: 'from-pink-500 to-rose-600',
        posts: 3400,
        isJoined: false,
        recentActivity: 'New trailer discussion: Pathaan 2',
        trending: false,
    },
    {
        id: 5,
        name: 'Startup India',
        category: 'Business',
        emoji: '🚀',
        members: '28.3K',
        description: 'Indian startup ecosystem — funding, mentorship, aur networking. Build in India! 🇮🇳',
        gradient: 'from-green-500 to-emerald-600',
        posts: 890,
        isJoined: false,
        recentActivity: 'Investor AMA session tomorrow',
        trending: false,
    },
    {
        id: 6,
        name: 'UPSC Preparation',
        category: 'Education',
        emoji: '📚',
        members: '67.8K',
        description: 'UPSC aspirants ka support group. Notes, mock tests, aur motivation! 💪',
        gradient: 'from-amber-500 to-orange-600',
        posts: 4500,
        isJoined: true,
        recentActivity: 'Daily current affairs quiz posted',
        trending: true,
    },
    {
        id: 7,
        name: 'Rajasthani Culture',
        category: 'Regional',
        emoji: '🏰',
        members: '15.6K',
        description: 'Padharo Mhare Desh! Rajasthan ki sanskriti, khaana, aur baat-cheet 🐫',
        gradient: 'from-yellow-500 to-amber-600',
        posts: 670,
        isJoined: false,
        recentActivity: 'Photo contest: Best Rajasthani sunset',
        trending: false,
    },
    {
        id: 8,
        name: 'Yoga & Wellness',
        category: 'Culture',
        emoji: '🧘',
        members: '41.2K',
        description: 'Daily yoga, Ayurveda tips, aur healthy living. Mind, Body, Soul. 🕉️',
        gradient: 'from-teal-500 to-cyan-600',
        posts: 2100,
        isJoined: false,
        recentActivity: 'Morning yoga challenge started',
        trending: false,
    },
];

export default function Community() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [joinedGroups, setJoinedGroups] = useState(
        groups.filter((g) => g.isJoined).map((g) => g.id)
    );
    const [selectedGroup, setSelectedGroup] = useState(null);

    const filteredGroups =
        activeCategory === 'All'
            ? groups
            : groups.filter((g) => g.category === activeCategory);

    const toggleJoin = (id) => {
        setJoinedGroups((prev) =>
            prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
        );
    };

    if (selectedGroup) {
        const group = groups.find((g) => g.id === selectedGroup);
        const isJoined = joinedGroups.includes(group.id);
        return (
            <div className="animate-fade-in">
                {/* Group Cover */}
                <div className={`relative h-40 bg-gradient-to-br ${group.gradient}`}>
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent" />
                    <button
                        onClick={() => setSelectedGroup(null)}
                        className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="absolute bottom-4 left-4 flex items-end gap-3">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center text-3xl shadow-elevated border-2 border-dark-800`}>
                            {group.emoji}
                        </div>
                    </div>
                </div>

                {/* Group Info */}
                <div className="px-4 py-4 border-b border-white/5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-dark-50">{group.name}</h2>
                            <p className="text-xs text-dark-300 mt-0.5">{group.members} members • {group.posts} posts</p>
                        </div>
                        <button
                            onClick={() => toggleJoin(group.id)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${isJoined
                                    ? 'bg-white/5 text-dark-200 border border-white/10 hover:bg-white/10'
                                    : 'gradient-saffron text-white shadow-glow-saffron-sm hover:opacity-90'
                                }`}
                        >
                            {isJoined ? 'Joined ✓' : 'Join Group'}
                        </button>
                    </div>
                    <p className="text-sm text-dark-200 mt-2.5 leading-relaxed">{group.description}</p>
                </div>

                {/* Pinned Posts */}
                <div className="p-4">
                    <h3 className="text-[10px] font-bold text-dark-400 mb-3 tracking-wider">📌 PINNED</h3>
                    <div className="card-premium p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center text-sm shadow-sm">👤</div>
                            <div>
                                <p className="text-xs font-bold text-dark-50">Admin</p>
                                <p className="text-[10px] text-dark-400">Pinned post</p>
                            </div>
                        </div>
                        <p className="text-sm text-dark-200">Welcome to {group.name}! 🎉 Please read the community guidelines before posting. Be respectful and enjoy! 🙏</p>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="px-4 pb-4">
                    <h3 className="text-[10px] font-bold text-dark-400 mb-3 tracking-wider">RECENT ACTIVITY</h3>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card-premium p-4 mb-3 stagger-item" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                                    {['🧑', '👩', '👨'][i - 1]}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-dark-50">
                                        {['Rahul', 'Meera', 'Vijay'][i - 1]}
                                    </p>
                                    <p className="text-[10px] text-dark-400">{i} hour ago</p>
                                </div>
                            </div>
                            <p className="text-sm text-dark-200">
                                {[
                                    'Kya scene hai sabka? Aaj ka topic discuss karte hain! 🔥',
                                    'Amazing post dekha! Sabko share karo 🙌',
                                    'New member here! Bahut excited hoon join karke 🎊',
                                ][i - 1]}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5">
                <h2 className="text-base font-extrabold text-dark-50">Community Groups</h2>
                <p className="text-xs text-dark-400 mt-0.5">Apni tribe dhundho, connect karo! 🤝</p>
            </div>

            {/* Featured Groups Banner */}
            <div className="px-4 py-3 border-b border-white/5">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                    {groups.filter(g => g.trending).map((group) => (
                        <button
                            key={group.id}
                            onClick={() => setSelectedGroup(group.id)}
                            className={`relative flex-shrink-0 w-48 h-24 rounded-2xl bg-gradient-to-br ${group.gradient} overflow-hidden group active:scale-[0.98] transition-transform`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-2 right-2">
                                <span className="text-[9px] bg-red-500/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-bold">🔥 Hot</span>
                            </div>
                            <div className="absolute bottom-2.5 left-3 right-3">
                                <p className="text-white font-bold text-xs truncate">{group.name}</p>
                                <p className="text-white/60 text-[10px] mt-0.5">{group.members} members</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-white/5">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search groups..."
                        className="w-full bg-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-saffron-500/30 border border-white/5"
                    />
                </div>
            </div>

            {/* Category Chips */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-white/5">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${activeCategory === cat
                                ? 'gradient-saffron text-white shadow-glow-saffron-sm'
                                : 'bg-white/5 text-dark-200 hover:bg-white/10'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Groups List */}
            <div className="p-3 space-y-3">
                {filteredGroups.map((group, i) => {
                    const isJoined = joinedGroups.includes(group.id);
                    return (
                        <button
                            key={group.id}
                            onClick={() => setSelectedGroup(group.id)}
                            className="w-full card-premium overflow-hidden text-left stagger-item"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className={`h-1 bg-gradient-to-r ${group.gradient}`} />
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.gradient} flex items-center justify-center text-xl shadow-md flex-shrink-0`}>
                                        {group.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <h3 className="text-sm font-bold text-dark-50 truncate">{group.name}</h3>
                                                {group.trending && (
                                                    <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">🔥</span>
                                                )}
                                            </div>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleJoin(group.id);
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 flex-shrink-0 ${isJoined
                                                        ? 'bg-india-green-500/10 text-india-green-400 border border-india-green-500/20'
                                                        : 'gradient-saffron text-white shadow-glow-saffron-sm'
                                                    }`}
                                            >
                                                {isJoined ? 'Joined ✓' : 'Join'}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-dark-400 mt-0.5">{group.members} members • {group.category}</p>
                                        <p className="text-xs text-dark-300 mt-1.5 truncate">{group.recentActivity}</p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
