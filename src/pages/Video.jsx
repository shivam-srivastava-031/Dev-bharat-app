import { useState } from 'react';

const videos = [
    {
        id: 1,
        creator: 'DanceBharat',
        creatorAvatar: '💃',
        description: 'Garba night se ek amazing clip! 🔥 #Navratri #GarbaSteps #IndianDance',
        likes: '45.2K',
        comments: '1.2K',
        shares: '890',
        music: '🎵 Nagada Sang Dhol — Ram Leela',
        bgColor: 'from-orange-600 via-pink-600 to-purple-700',
    },
    {
        id: 2,
        creator: 'CricketKing',
        creatorAvatar: '🏏',
        description: 'Last ball six! India ne jeet liya! 🇮🇳🔥 Goosebumps wali feeling! #BleedBlue #CricketIndia',
        likes: '120K',
        comments: '8.5K',
        shares: '15K',
        music: '🎵 Chak De India — Title Track',
        bgColor: 'from-blue-700 via-blue-900 to-indigo-900',
    },
    {
        id: 3,
        creator: 'FoodieIndia',
        creatorAvatar: '🍛',
        description: 'Ye biryani dekhke aapke mooh mein paani aa jayega! 🤤 #StreetFood #IndianFood #Biryani',
        likes: '78.3K',
        comments: '3.1K',
        shares: '5.6K',
        music: '🎵 Butter — BTS (Remix)',
        bgColor: 'from-amber-700 via-red-700 to-rose-800',
    },
    {
        id: 4,
        creator: 'TravelBharat',
        creatorAvatar: '🏔️',
        description: 'Ladakh ki ye beauty kya hai yaar! 🏔️ Must visit once in life. #IncredibleIndia #Ladakh',
        likes: '200K',
        comments: '12K',
        shares: '25K',
        music: '🎵 Safar — Jab Harry Met Sejal',
        bgColor: 'from-cyan-700 via-sky-800 to-blue-900',
    },
];

export default function Video() {
    const [currentVideo, setCurrentVideo] = useState(0);
    const [liked, setLiked] = useState({});

    const handleLike = (id) => {
        setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const goNext = () => {
        setCurrentVideo((prev) => (prev + 1) % videos.length);
    };

    const goPrev = () => {
        setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
    };

    const video = videos[currentVideo];

    return (
        <div className="relative h-[calc(100dvh-120px)] bg-black overflow-hidden">
            {/* Video Background (simulated with gradient) */}
            <div className={`absolute inset-0 bg-gradient-to-b ${video.bgColor} transition-all duration-500`}>
                {/* Simulated video content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center animate-pulse-soft">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <p className="text-white/60 text-sm">Tap to play</p>
                    </div>
                </div>

                {/* Swipe indicators */}
                <button onClick={goPrev} className="absolute top-1/2 left-0 w-1/3 h-1/2 -translate-y-1/2 z-10" aria-label="Previous video" />
                <button onClick={goNext} className="absolute top-1/2 right-0 w-1/3 h-1/2 -translate-y-1/2 z-10" aria-label="Next video" />
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-20">
                {/* Like */}
                <button onClick={() => handleLike(video.id)} className="flex flex-col items-center gap-1 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${liked[video.id] ? 'bg-red-500 scale-110' : 'bg-white/20 backdrop-blur-sm'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill={liked[video.id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <span className="text-white text-xs font-semibold">{video.likes}</span>
                </button>

                {/* Comment */}
                <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <span className="text-white text-xs font-semibold">{video.comments}</span>
                </button>

                {/* Share */}
                <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                    <span className="text-white text-xs font-semibold">{video.shares}</span>
                </button>

                {/* Follow */}
                <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-saffron-500 flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg font-bold">+</span>
                    </div>
                </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-3 right-16 z-20">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-lg">
                        {video.creatorAvatar}
                    </div>
                    <span className="text-white font-bold text-sm">@{video.creator}</span>
                    <button className="px-3 py-1 rounded-full border border-white/60 text-white text-xs font-medium hover:bg-white/20 transition-colors">
                        Follow
                    </button>
                </div>
                <p className="text-white text-sm leading-relaxed mb-2 drop-shadow-lg">{video.description}</p>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit">
                    <span className="text-xs text-white/90">{video.music}</span>
                </div>
            </div>

            {/* Progress Dots */}
            <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 z-20">
                {videos.map((_, i) => (
                    <div
                        key={i}
                        className={`h-0.5 rounded-full transition-all duration-300 ${i === currentVideo ? 'w-6 bg-saffron-500' : 'w-3 bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
