import { useState } from 'react';
import PostCard from '../components/PostCard';

const stories = [
    { id: 1, name: 'Priya', emoji: '👩', gradient: 'from-saffron-400 to-pink-500', hasNew: true },
    { id: 2, name: 'Raj', emoji: '👨', gradient: 'from-india-green-400 to-teal-500', hasNew: true },
    { id: 3, name: 'Meera', emoji: '👩‍🦱', gradient: 'from-purple-400 to-indigo-500', hasNew: true },
    { id: 4, name: 'Arjun', emoji: '🧑', gradient: 'from-blue-400 to-cyan-500', hasNew: false },
    { id: 5, name: 'Ananya', emoji: '👧', gradient: 'from-red-400 to-orange-500', hasNew: true },
    { id: 6, name: 'Vikram', emoji: '👴', gradient: 'from-yellow-400 to-amber-500', hasNew: false },
    { id: 7, name: 'Kavya', emoji: '👩‍🎨', gradient: 'from-pink-400 to-rose-500', hasNew: true },
];

const posts = [
    {
        id: 1,
        avatar: 'RK',
        author: 'Raj Kumar',
        time: '2 ghante pehle',
        content: '🪔 Diwali ki safai shuru! Ghar ko naya look de rahe hain. Family ke saath masti bhi ho rahi hai. #DiwaliPrep #IndianFestivals',
        image: null,
        imageBg: '#FF9933',
        likes: 234,
        comments: 45,
    },
    {
        id: 2,
        avatar: 'PM',
        author: 'Priya Mehta',
        time: '4 ghante pehle',
        content: 'Just watched the most amazing sunset from Marine Drive! 🌅 Mumbai never fails to surprise. Ye city meri jaan hai! ❤️ #MumbaiDiaries #MarineDrive',
        image: null,
        imageBg: '#FFB533',
        likes: 567,
        comments: 89,
    },
    {
        id: 3,
        avatar: 'AS',
        author: 'Ankit Sharma',
        time: '5 ghante pehle',
        content: '🏏 What a match yaar! India ne last ball pe game jeet liya. Kohli ki century was absolutely incredible! Goosebumps moment! 🇮🇳🔥\n\n#IndiaVsAus #CricketFever #BleedBlue',
        image: null,
        imageBg: '#3B82F6',
        likes: 1203,
        comments: 312,
    },
    {
        id: 4,
        avatar: 'NS',
        author: 'Neha Singh',
        time: '8 ghante pehle',
        content: 'Started learning Kathak from Guru ji today! 💃 Indian classical dance is such a beautiful art form. Feeling grateful for our rich culture. 🙏\n\n#Kathak #IndianDance #ClassicalArt',
        image: null,
        imageBg: '#A855F7',
        likes: 89,
        comments: 23,
    },
    {
        id: 5,
        avatar: 'VR',
        author: 'Vivek Reddy',
        time: '12 ghante pehle',
        content: '🍛 Made the perfect Hyderabadi biryani today! Secret ingredient — dum cooking for 45 mins. Aroma se poora ghar mein khushbu aa gayi! Recipe share karun kya?\n\n#HyderabadiBiryani #IndianFood #Foodie',
        image: null,
        imageBg: '#F59E0B',
        likes: 445,
        comments: 156,
    },
];

const filterChips = ['🔥 Trending', '🏏 Cricket', '🎬 Bollywood', '💻 Tech', '🍛 Food', '🎵 Music'];

export default function Feed() {
    const [activeFilter, setActiveFilter] = useState(0);

    return (
        <div>
            {/* Stories Row */}
            <div className="border-b border-white/5 px-3 py-3">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                    {/* Your Story */}
                    <button className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
                        <div className="relative w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border-2 border-dashed border-dark-400 group-hover:border-saffron-500/50 transition-colors">
                            <span className="text-2xl">📷</span>
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full gradient-saffron flex items-center justify-center shadow-glow-saffron-sm">
                                <span className="text-white text-xs font-bold">+</span>
                            </div>
                        </div>
                        <span className="text-[10px] text-dark-300 font-medium">Your Story</span>
                    </button>

                    {/* Other Stories */}
                    {stories.map((story) => (
                        <button
                            key={story.id}
                            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                        >
                            <div
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-105 group-active:scale-95 ${story.hasNew
                                        ? `p-0.5 bg-gradient-to-br ${story.gradient} shadow-lg`
                                        : 'border-2 border-dark-500'
                                    }`}
                            >
                                <div className="w-full h-full rounded-[14px] bg-dark-800 flex items-center justify-center">
                                    <span>{story.emoji}</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-dark-200 font-medium">{story.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
                {filterChips.map((chip, i) => (
                    <button
                        key={chip}
                        onClick={() => setActiveFilter(i)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${i === activeFilter
                                ? 'gradient-saffron text-white shadow-glow-saffron-sm'
                                : 'bg-white/5 text-dark-200 border border-white/5 hover:border-saffron-500/30 hover:text-saffron-400'
                            }`}
                    >
                        {chip}
                    </button>
                ))}
            </div>

            {/* Posts */}
            <div className="flex flex-col gap-3 px-3 pb-4">
                {posts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                ))}
            </div>

            {/* Create Post FAB */}
            <button className="fab gradient-saffron" aria-label="Create post">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    );
}
