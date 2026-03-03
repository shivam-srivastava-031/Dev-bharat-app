// YouTube Data API v3 — Free: 10,000 units/day
// https://console.cloud.google.com

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const isDemoMode = () => !API_KEY || API_KEY === 'your_youtube_api_key';

const demoVideos = [
    { id: { videoId: 'dQw4w9WgXcQ' }, snippet: { title: 'Garba Night se ek amazing clip! 🔥 #Navratri #GarbaSteps', channelTitle: '@DanceBharat', thumbnails: { high: { url: 'https://images.unsplash.com/photo-1594815076049-00a1d74a4aff?w=800' } }, publishedAt: '2026-03-01T10:00:00Z' }, statistics: { viewCount: '45200', likeCount: '1200' } },
    { id: { videoId: 'abc123' }, snippet: { title: 'Mumbai Street Food Tour 🍔 Vada Pav to Biryani!', channelTitle: '@FoodieIndia', thumbnails: { high: { url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800' } }, publishedAt: '2026-02-28T14:00:00Z' }, statistics: { viewCount: '128000', likeCount: '8900' } },
    { id: { videoId: 'def456' }, snippet: { title: 'React Native Tutorial in Hindi 💻 #CodingIndia', channelTitle: '@TechGuru', thumbnails: { high: { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800' } }, publishedAt: '2026-02-27T08:00:00Z' }, statistics: { viewCount: '67000', likeCount: '3400' } },
    { id: { videoId: 'ghi789' }, snippet: { title: 'IPL 2026 Highlights — MI vs CSK 🏏🔥', channelTitle: '@CricketBuzz', thumbnails: { high: { url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800' } }, publishedAt: '2026-03-02T18:00:00Z' }, statistics: { viewCount: '890000', likeCount: '45200' } },
    { id: { videoId: 'jkl012' }, snippet: { title: 'Sunrise at Varanasi Ghat 🕉️ Most Peaceful Video', channelTitle: '@TravelBharat', thumbnails: { high: { url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800' } }, publishedAt: '2026-02-25T06:00:00Z' }, statistics: { viewCount: '234000', likeCount: '12000' } },
];

/**
 * Search YouTube videos
 */
export async function searchVideos(query = 'Indian trending', maxResults = 10) {
    if (isDemoMode()) return demoVideos.slice(0, maxResults);

    try {
        const res = await fetch(
            `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&regionCode=IN&relevanceLanguage=hi&key=${API_KEY}`
        );
        if (!res.ok) throw new Error(`YouTube: ${res.status}`);
        const data = await res.json();
        return data.items || [];
    } catch (error) {
        console.warn('YouTube error, using demo:', error.message);
        return demoVideos;
    }
}

/**
 * Get trending videos in India
 */
export async function getTrendingVideos(maxResults = 10) {
    if (isDemoMode()) return demoVideos;

    try {
        const res = await fetch(
            `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=${maxResults}&key=${API_KEY}`
        );
        if (!res.ok) throw new Error(`YouTube: ${res.status}`);
        const data = await res.json();
        return data.items || [];
    } catch (error) {
        console.warn('YouTube error, using demo:', error.message);
        return demoVideos;
    }
}

/**
 * Get YouTube Shorts / trending short videos
 * Uses trending endpoint first (includes stats), falls back to search
 */
export async function getShorts(maxResults = 10) {
    if (isDemoMode()) return demoVideos;

    try {
        // Try trending first — includes statistics and higher quality data
        const res = await fetch(
            `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&videoCategoryId=10&maxResults=${maxResults}&key=${API_KEY}`
        );
        if (!res.ok) {
            // Fallback to search if trending fails
            const searchRes = await fetch(
                `${BASE_URL}/search?part=snippet&q=trending India shorts&type=video&videoDuration=short&maxResults=${maxResults}&regionCode=IN&key=${API_KEY}`
            );
            if (!searchRes.ok) throw new Error(`YouTube: ${searchRes.status}`);
            const searchData = await searchRes.json();
            return (searchData.items || []).map(item => ({
                ...item,
                statistics: { viewCount: '0', likeCount: '0' },
            }));
        }
        const data = await res.json();
        // Trending returns {id: "string"} not {id: {videoId: "string"}}  
        return (data.items || []).map(item => ({
            id: { videoId: item.id },
            snippet: item.snippet,
            statistics: item.statistics || { viewCount: '0', likeCount: '0' },
        }));
    } catch (error) {
        console.warn('YouTube error, using demo:', error.message);
        return demoVideos;
    }
}

/**
 * Get video embed URL
 */
export function getEmbedUrl(videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Format view count
 */
export function formatViews(count) {
    const num = parseInt(count);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}
