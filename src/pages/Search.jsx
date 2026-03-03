import { useState, useEffect } from 'react';
import { getTopHeadlines, searchNews, formatNewsDate } from '../services/newsService';
import { getCurrentMatches, formatScore } from '../services/cricketService';
import { getCurrentWeather, getForecast } from '../services/weatherService';

const categories = [
    { id: 1, name: 'People', emoji: '👤', count: '120+' },
    { id: 2, name: 'Groups', emoji: '👥', count: '45' },
    { id: 3, name: 'Videos', emoji: '🎬', count: '500+' },
    { id: 4, name: 'News', emoji: '📰', count: '200+' },
    { id: 5, name: 'Music', emoji: '🎵', count: '300+' },
    { id: 6, name: 'Places', emoji: '📍', count: '80+' },
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
    const [news, setNews] = useState([]);
    const [cricket, setCricket] = useState([]);
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [newsData, cricketData, weatherData, forecastData] = await Promise.all([
                getTopHeadlines('general', 6),
                getCurrentMatches(),
                getCurrentWeather('Delhi'),
                getForecast('Delhi'),
            ]);
            setNews(newsData);
            setCricket(cricketData.slice(0, 3));
            setWeather(weatherData);
            setForecast(forecastData);
        } catch (err) {
            console.warn('Search load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const results = await searchNews(query, 8);
            setSearchResults(results);
        } catch (err) {
            console.warn('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

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
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search BharatApp..."
                        className="w-full bg-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-saffron-500/40 border border-white/5 transition-all font-medium"
                    />
                    {query && (
                        <button onClick={() => { setQuery(''); setSearchResults([]); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-dark-300 text-xs">✕</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 ? (
                <div className="px-4 py-3 space-y-3">
                    <h3 className="text-xs font-bold text-dark-300 tracking-wider">RESULTS FOR "{query}"</h3>
                    {searchResults.map((article, i) => (
                        <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" className="card-premium overflow-hidden block stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                            {article.image && <img src={article.image} alt={article.title} className="w-full h-32 object-cover" />}
                            <div className="p-3">
                                <p className="text-sm font-bold text-dark-50 leading-snug">{article.title}</p>
                                <p className="text-xs text-dark-400 mt-1">{article.source?.name} · {formatNewsDate(article.publishedAt)}</p>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <>
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

                    {/* Weather Widget */}
                    {weather && (
                        <div className="px-4 py-3 border-b border-white/5">
                            <h3 className="text-xs font-bold text-dark-300 tracking-wider mb-3">🌤️ WEATHER — {weather.city}</h3>
                            <div className="card-premium p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-3xl font-extrabold text-dark-50">{weather.temp}°C</p>
                                        <p className="text-xs text-dark-300">{weather.description} · Feels {weather.feels_like}°C</p>
                                    </div>
                                    <span className="text-5xl">{weather.icon}</span>
                                </div>
                                <div className="flex gap-4 text-xs text-dark-400 border-t border-white/5 pt-3">
                                    <span>💧 {weather.humidity}%</span>
                                    <span>🌬️ {weather.wind} km/h</span>
                                </div>
                                {forecast.length > 0 && (
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5 overflow-x-auto scrollbar-hide">
                                        {forecast.map((day, i) => (
                                            <div key={i} className="flex-shrink-0 text-center px-2 py-1.5 rounded-xl bg-white/3">
                                                <p className="text-[10px] text-dark-400 font-medium">{day.day}</p>
                                                <p className="text-lg my-1">{day.icon}</p>
                                                <p className="text-[10px] text-dark-200 font-bold">{day.high}°</p>
                                                <p className="text-[9px] text-dark-400">{day.low}°</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Live Cricket */}
                    {cricket.length > 0 && (
                        <div className="px-4 py-3 border-b border-white/5">
                            <h3 className="text-xs font-bold text-dark-300 tracking-wider mb-3">🏏 LIVE CRICKET</h3>
                            <div className="space-y-2">
                                {cricket.map((match, i) => (
                                    <div key={match.id || i} className="card-premium overflow-hidden stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                                        <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                                        <div className="p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-bold text-dark-50">{match.name}</p>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${match.status === 'Live' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-dark-400'
                                                    }`}>{match.status}</span>
                                            </div>
                                            <p className="text-[10px] text-dark-400">{match.venue}</p>
                                            {match.score?.length > 0 && (
                                                <p className="text-xs text-saffron-400 font-semibold mt-1.5">{formatScore(match.score)}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trending News */}
                    <div className="px-4 py-3 border-b border-white/5">
                        <h3 className="text-xs font-bold text-dark-300 tracking-wider mb-3">📰 TRENDING NEWS</h3>
                        <div className="space-y-2">
                            {loading ? (
                                <div className="flex items-center justify-center py-6">
                                    <div className="w-8 h-8 rounded-xl gradient-saffron animate-pulse-glow" />
                                </div>
                            ) : news.map((article, i) => (
                                <a
                                    key={i}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all stagger-item"
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    {article.image && (
                                        <img src={article.image} alt="" className="w-20 h-16 rounded-lg object-cover flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-dark-50 leading-snug line-clamp-2">{article.title}</p>
                                        <p className="text-[10px] text-dark-400 mt-1">{article.source?.name} · {formatNewsDate(article.publishedAt)}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Suggested People */}
                    <div className="px-4 py-3 pb-6">
                        <h3 className="text-xs font-bold text-dark-300 tracking-wider mb-3">SUGGESTED FOR YOU</h3>
                        <div className="space-y-2">
                            {suggestedPeople.map((person, i) => (
                                <div key={person.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-xl shadow-md">{person.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-sm font-bold text-dark-50 truncate">{person.name}</p>
                                            {person.verified && <span className="text-[9px] bg-saffron-500/20 text-saffron-400 px-1.5 py-0.5 rounded-full font-bold">✓</span>}
                                        </div>
                                        <p className="text-[11px] text-dark-400">{person.handle} · {person.followers} followers</p>
                                    </div>
                                    <button className="px-4 py-2 rounded-xl gradient-saffron text-white text-[11px] font-bold shadow-glow-saffron-sm active:scale-95 transition-transform">Follow</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
