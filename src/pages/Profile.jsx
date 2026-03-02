import { useState } from 'react';

const userStats = [
    { label: 'Posts', value: '128' },
    { label: 'Followers', value: '2.4K' },
    { label: 'Following', value: '356' },
];

const userPosts = [
    { id: 1, emoji: '🏏', bg: 'from-blue-500 to-indigo-600', likes: '1.2K' },
    { id: 2, emoji: '🍛', bg: 'from-orange-500 to-red-600', likes: '890' },
    { id: 3, emoji: '🎬', bg: 'from-pink-500 to-rose-600', likes: '2.3K' },
    { id: 4, emoji: '💻', bg: 'from-cyan-500 to-blue-600', likes: '567' },
    { id: 5, emoji: '🏔️', bg: 'from-emerald-500 to-teal-600', likes: '3.1K' },
    { id: 6, emoji: '🎵', bg: 'from-purple-500 to-violet-600', likes: '445' },
    { id: 7, emoji: '🧘', bg: 'from-teal-500 to-cyan-600', likes: '234' },
    { id: 8, emoji: '🪔', bg: 'from-amber-500 to-orange-600', likes: '1.8K' },
    { id: 9, emoji: '🚀', bg: 'from-green-500 to-emerald-600', likes: '678' },
];

const menuItems = [
    { icon: '🔖', label: 'Saved Posts', count: '24' },
    { icon: '👥', label: 'My Groups', count: '6' },
    { icon: '🤖', label: 'BharatAI Chats', count: '12' },
    { icon: '📊', label: 'Activity', count: '' },
    { icon: '⚙️', label: 'Settings', count: '' },
    { icon: '🌙', label: 'Dark Mode', count: 'On' },
    { icon: '🇮🇳', label: 'Language', count: 'Hinglish' },
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <div className="animate-fade-in">
            {/* Profile Header */}
            <div className="relative">
                {/* Cover gradient */}
                <div className="h-28 bg-gradient-to-br from-saffron-500 via-saffron-600 to-india-green-600 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
                    {/* Edit cover */}
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 text-xs">
                        📷
                    </button>
                </div>

                {/* Avatar */}
                <div className="px-4 -mt-10 relative z-10">
                    <div className="flex items-end justify-between">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-4xl shadow-elevated ring-4 ring-dark-800">
                                🧑
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-india-green-400 border-2 border-dark-800 flex items-center justify-center shadow-glow-green">
                                <span className="text-[8px] text-white font-bold">✓</span>
                            </div>
                        </div>
                        <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-dark-100 hover:bg-white/10 transition-all active:scale-95">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* User Info */}
                <div className="px-4 mt-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-extrabold text-dark-50">Shivam Srivastava</h2>
                        <span className="text-[9px] bg-saffron-500/20 text-saffron-400 px-2 py-0.5 rounded-full font-bold">✓ Verified</span>
                    </div>
                    <p className="text-xs text-dark-400 mt-0.5">@shivam_dev · Joined March 2026</p>
                    <p className="text-sm text-dark-200 mt-2 leading-relaxed">
                        🚀 Building cool stuff with code | 🇮🇳 Proud Indian | 💻 Full-stack dev | 🏏 Cricket lover
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-4 pb-4 border-b border-white/5">
                        {userStats.map((stat) => (
                            <button key={stat.label} className="text-center group">
                                <p className="text-lg font-extrabold text-dark-50 group-hover:text-saffron-400 transition-colors">{stat.value}</p>
                                <p className="text-[10px] text-dark-400 font-medium">{stat.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
                {[
                    { id: 'posts', label: 'Posts', icon: '📝' },
                    { id: 'reels', label: 'Reels', icon: '🎬' },
                    { id: 'saved', label: 'Saved', icon: '🔖' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all relative ${activeTab === tab.id ? 'text-saffron-400' : 'text-dark-400 hover:text-dark-200'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full gradient-saffron" />
                        )}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            {activeTab === 'posts' && (
                <div className="grid grid-cols-3 gap-0.5 p-0.5">
                    {userPosts.map((post, i) => (
                        <button
                            key={post.id}
                            className={`relative aspect-square bg-gradient-to-br ${post.bg} flex items-center justify-center text-3xl group overflow-hidden stagger-item`}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            {post.emoji}
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex items-center gap-1 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="text-xs font-bold">{post.likes}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Reels Tab */}
            {activeTab === 'reels' && (
                <div className="grid grid-cols-3 gap-0.5 p-0.5">
                    {userPosts.slice(0, 6).map((post, i) => (
                        <button
                            key={post.id}
                            className={`relative aspect-[9/16] bg-gradient-to-br ${post.bg} flex items-center justify-center text-2xl group overflow-hidden rounded-sm stagger-item`}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            {post.emoji}
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span className="text-[10px] font-bold">{post.likes}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Saved Tab */}
            {activeTab === 'saved' && (
                <div className="p-4 text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-3xl mx-auto mb-3">
                        🔖
                    </div>
                    <h3 className="text-sm font-bold text-dark-100">Saved Posts</h3>
                    <p className="text-xs text-dark-400 mt-1">Posts you save will appear here</p>
                </div>
            )}

            {/* Menu */}
            <div className="mt-2 border-t border-white/5">
                <div className="px-4 py-3">
                    <h3 className="text-[10px] font-bold text-dark-400 tracking-wider mb-2">SETTINGS & MORE</h3>
                </div>
                {menuItems.map((item, i) => (
                    <button
                        key={item.label}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors text-left"
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="flex-1 text-sm text-dark-100 font-medium">{item.label}</span>
                        <div className="flex items-center gap-2">
                            {item.count && (
                                <span className="text-[11px] text-dark-400 font-medium">{item.count}</span>
                            )}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>

            {/* Logout */}
            <div className="px-4 py-4 border-t border-white/5">
                <button className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-sm font-bold hover:bg-red-500/15 transition-all active:scale-[0.99]">
                    Log Out
                </button>
            </div>
        </div>
    );
}
