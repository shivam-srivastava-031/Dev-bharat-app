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
        imageBg: '#FFF3E0',
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
        imageBg: '#FFE0B2',
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
        imageBg: '#E3F2FD',
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
        imageBg: '#F3E5F5',
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
        imageBg: '#FFF3E0',
        likes: 445,
        comments: 156,
    },
];

export default function Feed() {
    const [activeStory, setActiveStory] = useState(null);

    return (
        <div className="animate-fade-in">
            {/* Stories Row */}
            <div className="bg-white border-b border-gray-100 px-3 py-3">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                    {/* Your Story */}
                    <button className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-2xl">📷</span>
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-saffron-500 flex items-center justify-center shadow-sm">
                                <span className="text-white text-xs font-bold">+</span>
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">Your Story</span>
                    </button>

                    {/* Other Stories */}
                    {stories.map((story) => (
                        <button
                            key={story.id}
                            onClick={() => setActiveStory(story.id)}
                            className="flex flex-col items-center gap-1 flex-shrink-0"
                        >
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${story.hasNew
                                        ? `p-0.5 bg-gradient-to-br ${story.gradient}`
                                        : 'border-2 border-gray-200'
                                    }`}
                            >
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                    <span>{story.emoji}</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-600 font-medium">{story.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto">
                {['🔥 Trending', '🏏 Cricket', '🎬 Bollywood', '💻 Tech', '🍛 Food', '🎵 Music'].map((chip, i) => (
                    <button
                        key={chip}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${i === 0
                                ? 'gradient-saffron text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-saffron-300 hover:text-saffron-600'
                            }`}
                    >
                        {chip}
                    </button>
                ))}
            </div>

            {/* Posts */}
            <div className="flex flex-col gap-3 px-3 pb-4">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
