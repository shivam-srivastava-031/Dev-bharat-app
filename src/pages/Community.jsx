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
                <div className={`relative h-36 bg-gradient-to-br ${group.gradient}`}>
                    <button
                        onClick={() => setSelectedGroup(null)}
                        className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <span className="text-4xl">{group.emoji}</span>
                    </div>
                </div>

                {/* Group Info */}
                <div className="bg-white px-4 py-4 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{group.name}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{group.members} members • {group.posts} posts</p>
                        </div>
                        <button
                            onClick={() => toggleJoin(group.id)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${isJoined
                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    : 'gradient-saffron text-white shadow-md hover:opacity-90'
                                }`}
                        >
                            {isJoined ? 'Joined ✓' : 'Join Group'}
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{group.description}</p>
                </div>

                {/* Pinned Posts */}
                <div className="p-4">
                    <h3 className="text-xs font-semibold text-gray-400 mb-3">📌 PINNED</h3>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full gradient-saffron flex items-center justify-center text-sm">👤</div>
                            <div>
                                <p className="text-xs font-semibold text-gray-800">Admin</p>
                                <p className="text-[10px] text-gray-400">Pinned post</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700">Welcome to {group.name}! 🎉 Please read the community guidelines before posting. Be respectful and enjoy! 🙏</p>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="px-4 pb-4">
                    <h3 className="text-xs font-semibold text-gray-400 mb-3">RECENT ACTIVITY</h3>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                    {['🧑', '👩', '👨'][i - 1]}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">
                                        {['Rahul', 'Meera', 'Vijay'][i - 1]}
                                    </p>
                                    <p className="text-[10px] text-gray-400">{i} hour ago</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
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
        <div className="animate-fade-in">
            {/* Header */}
            <div className="bg-white px-4 py-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-800">Community Groups</h2>
                <p className="text-xs text-gray-400 mt-0.5">Apni tribe dhundho, connect karo! 🤝</p>
            </div>

            {/* Search */}
            <div className="px-4 py-3 bg-white border-b border-gray-100">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search groups..."
                        className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    />
                </div>
            </div>

            {/* Category Chips */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-white border-b border-gray-100">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                ? 'gradient-saffron text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Groups List */}
            <div className="p-3 space-y-3">
                {filteredGroups.map((group) => {
                    const isJoined = joinedGroups.includes(group.id);
                    return (
                        <button
                            key={group.id}
                            onClick={() => setSelectedGroup(group.id)}
                            className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
                        >
                            <div className={`h-2 bg-gradient-to-r ${group.gradient}`} />
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.gradient} flex items-center justify-center text-xl shadow-md`}>
                                        {group.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-800 truncate">{group.name}</h3>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleJoin(group.id);
                                                }}
                                                className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${isJoined
                                                        ? 'bg-india-green-50 text-india-green-600 border border-india-green-200'
                                                        : 'gradient-saffron text-white shadow-sm'
                                                    }`}
                                            >
                                                {isJoined ? 'Joined ✓' : 'Join'}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{group.members} members • {group.category}</p>
                                        <p className="text-xs text-gray-500 mt-1 truncate">{group.recentActivity}</p>
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
