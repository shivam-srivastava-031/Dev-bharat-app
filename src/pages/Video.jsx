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
    const [showHeart, setShowHeart] = useState(false);

    const handleLike = (id) => {
        setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDoubleTap = () => {
        const video = videos[currentVideo];
        if (!liked[video.id]) {
            setLiked(prev => ({ ...prev, [video.id]: true }));
        }
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
    };

    const goNext = () => {
        setCurrentVideo((prev) => (prev + 1) % videos.length);
    };

    const goPrev = () => {
        setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
    };

    const video = videos[currentVideo];
    const progress = ((currentVideo + 1) / videos.length) * 100;

    return (
        <div className="relative h-[calc(100dvh-120px)] bg-black overflow-hidden">
            {/* Video Background */}
            <div className={`absolute inset-0 bg-gradient-to-b ${video.bgColor} transition-all duration-700`}>
                {/* Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                {/* Center play button */}
                <div className="absolute inset-0 flex items-center justify-center" onDoubleClick={handleDoubleTap}>
                    <div className="text-center">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto backdrop-blur-md border border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            {/* Pulse ring */}
                            <div className="absolute inset-0 w-20 h-20 rounded-full bg-white/10 mx-auto animate-ping" style={{ animationDuration: '2s' }} />
                        </div>
                        <p className="text-white/40 text-xs mt-4 font-medium">Tap to play</p>
                    </div>
                </div>

                {/* Double-tap heart animation */}
                {showHeart && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500 animate-heart-beat opacity-90" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                )}

                {/* Navigation areas */}
                <button onClick={goPrev} className="absolute top-0 left-0 w-1/3 h-full z-10" aria-label="Previous video" />
                <button onClick={goNext} className="absolute top-0 right-0 w-1/3 h-full z-10" aria-label="Next video" />
            </div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 px-2 pt-2">
                <div className="flex gap-1">
                    {videos.map((_, i) => (
                        <div key={i} className="flex-1 h-[3px] rounded-full bg-white/15 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${i < currentVideo
                                        ? 'w-full bg-white/70'
                                        : i === currentVideo
                                            ? 'w-full bg-gradient-to-r from-saffron-400 to-saffron-500'
                                            : 'w-0'
                                    }`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-20">
                {/* Like */}
                <button onClick={() => handleLike(video.id)} className="flex flex-col items-center gap-1.5 group">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${liked[video.id]
                            ? 'bg-red-500/20 backdrop-blur-md border border-red-500/30 scale-110'
                            : 'bg-white/10 backdrop-blur-md border border-white/10 group-hover:bg-white/20'
                        }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all ${liked[video.id] ? 'text-red-400 animate-heart-beat' : 'text-white'}`} fill={liked[video.id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <span className="text-white text-[11px] font-bold drop-shadow-lg">{video.likes}</span>
                </button>

                {/* Comment */}
                <button className="flex flex-col items-center gap-1.5 group">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <span className="text-white text-[11px] font-bold drop-shadow-lg">{video.comments}</span>
                </button>

                {/* Share */}
                <button className="flex flex-col items-center gap-1.5 group">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                    <span className="text-white text-[11px] font-bold drop-shadow-lg">{video.shares}</span>
                </button>

                {/* Follow */}
                <button className="flex flex-col items-center gap-1">
                    <div className="w-11 h-11 rounded-2xl gradient-saffron flex items-center justify-center shadow-glow-saffron-sm active:scale-95 transition-transform">
                        <span className="text-white text-lg font-bold">+</span>
                    </div>
                </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-3 right-16 z-20">
                <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-lg shadow-lg ring-2 ring-white/20">
                        {video.creatorAvatar}
                    </div>
                    <span className="text-white font-extrabold text-sm drop-shadow-lg">@{video.creator}</span>
                    <button className="px-4 py-1.5 rounded-xl border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-all backdrop-blur-sm active:scale-95">
                        Follow
                    </button>
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-3 drop-shadow-lg">{video.description}</p>
                <div className="flex items-center gap-2 bg-white/8 backdrop-blur-md rounded-xl px-3 py-2 w-fit border border-white/10">
                    <div className="overflow-hidden max-w-[200px]">
                        <span className="text-[11px] text-white/80 font-medium whitespace-nowrap inline-block animate-marquee">{video.music}&nbsp;&nbsp;&nbsp;{video.music}</span>
                    </div>
                </div>
            </div>

            {/* Swipe indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/30 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
