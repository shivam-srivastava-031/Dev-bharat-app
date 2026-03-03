import { useState, useEffect } from 'react';
import { getTrendingVideos, getShorts, formatViews } from '../services/youtubeService';

export default function Video() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState({});
    const [showHeart, setShowHeart] = useState(false);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        setLoading(true);
        try {
            const data = await getShorts(10);
            setVideos(data.map(v => ({
                id: v.id?.videoId || v.id,
                thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.default?.url,
                title: v.snippet?.title || 'Video',
                channel: v.snippet?.channelTitle || 'BharatApp',
                views: formatViews(v.statistics?.viewCount || '0'),
                likes: formatViews(v.statistics?.likeCount || '0'),
                publishedAt: v.snippet?.publishedAt,
            })));
        } catch (err) {
            console.warn('Video load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const current = videos[currentIndex] || {};

    const goNext = () => setCurrentIndex((prev) => (prev + 1) % Math.max(videos.length, 1));
    const goPrev = () => setCurrentIndex((prev) => (prev - 1 + videos.length) % Math.max(videos.length, 1));

    const handleDoubleTap = () => {
        setLiked(prev => ({ ...prev, [currentIndex]: true }));
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
    };

    if (loading) {
        return (
            <div className="h-[calc(100dvh-120px)] flex items-center justify-center">
                <div className="w-10 h-10 rounded-xl gradient-saffron animate-pulse-glow" />
            </div>
        );
    }

    return (
        <div className="relative h-[calc(100dvh-120px)] overflow-hidden bg-black" onDoubleClick={handleDoubleTap}>
            {/* Segmented Progress Bar */}
            <div className="absolute top-2 left-3 right-3 z-20 flex gap-1">
                {videos.slice(0, 5).map((_, i) => (
                    <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/20">
                        <div className={`h-full rounded-full transition-all duration-300 ${i === currentIndex % 5 ? 'bg-white w-full' : i < currentIndex % 5 ? 'bg-white/60 w-full' : 'w-0'}`} />
                    </div>
                ))}
            </div>

            {/* Video Content */}
            <div className="absolute inset-0">
                {current.thumbnail ? (
                    <img src={current.thumbnail} alt={current.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-saffron-600 via-red-500 to-pink-600" />
                )}
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </div>

            {/* Floating Heart */}
            {showHeart && (
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500 animate-heart-beat" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
            )}

            {/* Play Button */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="relative cursor-pointer group" onClick={goNext}>
                    <div className="absolute inset-0 w-16 h-16 rounded-full bg-white/10 animate-pulse-glow -m-2" />
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/30 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <p className="text-center text-white/50 text-[10px] mt-2">Tap to play</p>
                </div>
            </div>

            {/* Right Action Buttons */}
            <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-5">
                <button onClick={() => setLiked(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }))} className="flex flex-col items-center gap-1">
                    <div className={`w-11 h-11 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${liked[currentIndex] ? 'bg-red-500/30 border-red-500/30 text-red-500' : 'bg-white/10 border-white/10 text-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${liked[currentIndex] ? 'animate-heart-beat' : ''}`} fill={liked[currentIndex] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={liked[currentIndex] ? 0 : 2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <span className="text-[10px] text-white font-bold">{current.likes}</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                    <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <span className="text-[10px] text-white font-bold">{current.views}</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                    <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                    <span className="text-[10px] text-white font-bold">Share</span>
                </button>
                <button className="w-11 h-11 rounded-xl gradient-saffron flex items-center justify-center shadow-glow-saffron-sm active:scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Video Info (Bottom) */}
            <div className="absolute bottom-4 left-3 right-16 z-20">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-xl gradient-saffron flex items-center justify-center text-sm shadow-md">🎬</div>
                    <span className="text-white font-bold text-sm">{current.channel}</span>
                    <button className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold border border-white/10">Follow</button>
                </div>
                <p className="text-white text-sm font-medium leading-snug line-clamp-2">{current.title}</p>
                <div className="flex items-center gap-2 mt-2 overflow-hidden">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10 max-w-full">
                        <span className="text-white text-xs animate-marquee whitespace-nowrap">
                            🎵 {current.title?.slice(0, 40)} — {current.channel} ♫ ♪
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <button onClick={goPrev} className="absolute left-0 top-0 bottom-0 w-1/3 z-10" />
            <button onClick={goNext} className="absolute right-0 top-0 bottom-0 w-1/3 z-10" />

            {/* Swipe Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20">
                <div className="w-8 h-1 rounded-full bg-white/30" />
            </div>
        </div>
    );
}
