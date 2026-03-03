import { useState, useEffect, useRef } from 'react';
import PostCard from '../components/PostCard';
import { getFeedPhotos } from '../services/unsplashService';
import { getTopHeadlines, formatNewsDate } from '../services/newsService';
import { getCurrentMatches, formatScore } from '../services/cricketService';
import { getCurrentWeather } from '../services/weatherService';
import { rankFeedServerSide } from '../services/rankingApi';
import { trackLike, trackSave, trackView, trackClick } from '../services/eventTracker';
import { getCollaborativeRecommendations } from '../services/collaborativeFilter';
import { cacheFeed, getCachedFeed } from '../services/offlineCache';

const stories = [
    { id: 0, name: 'Your Story', emoji: '📷', isOwn: true },
    { id: 1, name: 'Priya', emoji: '👩', ring: 'from-pink-500 to-rose-500' },
    { id: 2, name: 'Raj', emoji: '🧑', ring: 'from-saffron-400 to-red-500' },
    { id: 3, name: 'Meera', emoji: '👧', ring: 'from-green-400 to-emerald-500' },
    { id: 4, name: 'Arjun', emoji: '👦', ring: 'from-blue-400 to-indigo-500' },
    { id: 5, name: 'Ananya', emoji: '👩', ring: 'from-purple-400 to-violet-500' },
    { id: 6, name: 'Vikram', emoji: '🧔', ring: 'from-orange-400 to-amber-500' },
];

const filters = ['🔥 Trending', '🏏 Cricket', '🎬 Bollywood', '💻 Tech', '🍛 Food', '🧳 Travel'];

export default function Feed() {
    const [activeFilter, setActiveFilter] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [news, setNews] = useState([]);
    const [cricket, setCricket] = useState([]);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isStale, setIsStale] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const filterTopics = ['India trending', 'cricket India', 'Bollywood movies', 'tech India startup', 'Indian food', 'India travel'];

    useEffect(() => {
        loadData();
    }, [activeFilter]);

    const loadData = async () => {
        const filterKey = filterTopics[activeFilter];

        // 1. INSTANT: show cached feed from IndexedDB
        try {
            const cached = await getCachedFeed(filterKey);
            if (cached?.data) {
                const { photos: cp, news: cn, cricket: cc, weather: cw } = cached.data;
                setPhotos(cp || []);
                setNews(cn || []);
                setCricket(cc || []);
                setWeather(cw || null);
                setLoading(false);
                setIsStale(true);
            }
        } catch (err) {
            // Cache miss — that's fine, will load from network
        }

        // 2. BACKGROUND: fetch fresh data
        setRefreshing(true);
        try {
            const [photosData, newsData, cricketData, weatherData] = await Promise.all([
                getFeedPhotos(filterKey),
                getTopHeadlines('general', 3),
                getCurrentMatches(),
                getCurrentWeather('Delhi'),
            ]);
            const freshPhotos = photosData.results || photosData;
            const freshCricket = cricketData.slice(0, 2);

            setPhotos(freshPhotos);
            setNews(newsData);
            setCricket(freshCricket);
            setWeather(weatherData);
            setIsStale(false);

            // 3. Cache for next time
            await cacheFeed(filterKey, {
                photos: freshPhotos,
                news: newsData,
                cricket: freshCricket,
                weather: weatherData,
            });
        } catch (err) {
            console.warn('Feed load error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Build raw posts from API data
    const rawPosts = [
        ...(weather ? [{
            id: 'weather', type: 'weather', data: weather,
            createdAt: new Date().toISOString(),
        }] : []),
        ...cricket.map((match, i) => ({
            id: `cricket-${i}`, type: 'cricket', data: match,
            category: 'cricket', createdAt: match.date || new Date().toISOString(),
        })),
        ...news.map((article, i) => ({
            id: `news-${i}`, type: 'news', data: article,
            category: 'news', createdAt: article.publishedAt || new Date().toISOString(),
        })),
        ...(Array.isArray(photos) ? photos : []).map((photo) => ({
            id: photo.id, type: 'post',
            author: photo.user?.name || 'BharatApp',
            avatar: photo.user?.name?.substring(0, 2).toUpperCase() || 'BA',
            time: '2 ghante pehle',
            content: photo.alt_description || 'Beautiful India 🇮🇳',
            image: photo.urls?.regular || photo.urls?.thumb,
            likes: photo.likes || 0,
            comments: Math.floor(Math.random() * 100),
            verified: Math.random() > 0.5,
            category: 'photos', createdAt: new Date().toISOString(),
        })),
    ];

    // 🧠 Rank feed — server-side (async) with client fallback
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        if (rawPosts.length === 0) return;
        let cancelled = false;
        rankFeedServerSide(rawPosts, { diversify: true, boostLive: true })
            .then(ranked => { if (!cancelled) setPosts(ranked); })
            .catch(() => setPosts(rawPosts));
        return () => { cancelled = true; };
    }, [photos, news, cricket, weather]);

    // Event tracking callbacks
    const handlePostLike = (postId, contentType) => trackLike(postId, contentType);
    const handlePostSave = (postId, contentType) => trackSave(postId, contentType);
    const handlePostView = (postId, contentType) => trackView(postId, contentType, 3000);
    const handlePostClick = (postId, contentType) => trackClick(postId, contentType);

    return (
        <div>
            {/* Stale data banner */}
            {isStale && refreshing && (
                <div className="flex items-center justify-center gap-2 py-1.5 bg-saffron-500/10 border-b border-saffron-500/20">
                    <div className="w-3 h-3 border-2 border-saffron-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-semibold text-saffron-400">Refreshing feed...</span>
                </div>
            )}
            {/* Stories */}
            <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-white/5">
                {stories.map((story) => (
                    <button key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0 group">
                        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-transform group-active:scale-95 ${story.isOwn ? 'bg-white/5 border-2 border-dashed border-white/10' : `bg-gradient-to-br ${story.ring} p-0.5`
                            }`}>
                            {story.isOwn ? (
                                <>
                                    <span>{story.emoji}</span>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full gradient-saffron flex items-center justify-center shadow-sm">
                                        <span className="text-white text-xs">+</span>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full rounded-[14px] bg-dark-700 flex items-center justify-center text-2xl">
                                    {story.emoji}
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] text-dark-300 w-14 truncate text-center">{story.name}</span>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide border-b border-white/5" style={{ scrollSnapType: 'x mandatory' }}>
                {filters.map((filter, i) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(i)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 scroll-snap-start ${activeFilter === i
                            ? 'gradient-saffron text-white shadow-glow-saffron-sm'
                            : 'bg-white/5 text-dark-200 hover:bg-white/10'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 rounded-xl gradient-saffron animate-pulse-glow" />
                </div>
            )}

            {/* Feed Content */}
            <div className="p-3 space-y-3">
                {posts.map((item, i) => {
                    // Weather Widget
                    if (item.type === 'weather') {
                        return (
                            <div key={item.id} className="card-premium p-4 stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-dark-400 font-bold tracking-wider">🌤️ WEATHER</p>
                                        <p className="text-2xl font-extrabold text-dark-50 mt-1">{item.data.temp}°C</p>
                                        <p className="text-xs text-dark-300">{item.data.description} · {item.data.city}</p>
                                    </div>
                                    <div className="text-4xl">{item.data.icon}</div>
                                </div>
                                <div className="flex gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-dark-400">
                                    <span>💧 {item.data.humidity}%</span>
                                    <span>🌬️ {item.data.wind} km/h</span>
                                    <span>🌡️ Feels {item.data.feels_like}°C</span>
                                </div>
                            </div>
                        );
                    }

                    // Cricket Live Score
                    if (item.type === 'cricket') {
                        return (
                            <div key={item.id} className="card-premium overflow-hidden stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] text-dark-400 font-bold tracking-wider">🏏 CRICKET</p>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${item.data.status === 'Live' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-dark-400'
                                            }`}>{item.data.status}</span>
                                    </div>
                                    <p className="text-sm font-bold text-dark-50">{item.data.name}</p>
                                    <p className="text-[11px] text-dark-400 mt-0.5">{item.data.venue}</p>
                                    {item.data.score?.length > 0 && (
                                        <p className="text-xs text-saffron-400 font-semibold mt-2">{formatScore(item.data.score)}</p>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    // News Article
                    if (item.type === 'news') {
                        return (
                            <div key={item.id} className="card-premium overflow-hidden stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                                {item.data.image && (
                                    <img src={item.data.image} alt={item.data.title} className="w-full h-36 object-cover" />
                                )}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[9px] bg-saffron-500/20 text-saffron-400 px-2 py-0.5 rounded-full font-bold">📰 NEWS</span>
                                        <span className="text-[10px] text-dark-400">{item.data.source?.name}</span>
                                    </div>
                                    <p className="text-sm font-bold text-dark-50 leading-snug">{item.data.title}</p>
                                    <p className="text-xs text-dark-300 mt-1 line-clamp-2">{item.data.description}</p>
                                </div>
                            </div>
                        );
                    }

                    // Regular Photo Post
                    return (
                        <PostCard
                            key={item.id}
                            post={item}
                            index={i}
                        />
                    );
                })}
            </div>

            {/* FAB */}
            <button className="fab" aria-label="Create post">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    );
}
