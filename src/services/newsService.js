// GNews API Service — Free: 100 req/day
// https://gnews.io

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';
const isDemoMode = () => !API_KEY || API_KEY === 'your_gnews_api_key';

const demoNews = [
    { title: 'IPL 2026: MI Wins Thrilling Match Against CSK', description: 'Mumbai Indians clinch victory in the last over with a stunning six by Rohit Sharma.', url: '#', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400', publishedAt: '2026-03-03T08:00:00Z', source: { name: 'CricBuzz', url: '#' } },
    { title: 'Budget 2026: FM Announces Tax Cuts for Middle Class', description: 'Finance Minister unveils major tax reforms benefiting salaried employees.', url: '#', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', publishedAt: '2026-03-02T12:00:00Z', source: { name: 'Economic Times', url: '#' } },
    { title: 'ISRO Launches Next-Gen Navigation Satellite', description: 'India\'s space agency successfully deploys NavIC-2 constellation satellite.', url: '#', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400', publishedAt: '2026-03-02T06:00:00Z', source: { name: 'NDTV', url: '#' } },
    { title: 'Bollywood: Shah Rukh Khan Announces New Film', description: 'SRK confirms collaboration with Rajkumar Hirani for a sci-fi drama.', url: '#', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400', publishedAt: '2026-03-01T10:00:00Z', source: { name: 'Filmfare', url: '#' } },
    { title: 'Indian Startup Raises $100M for AI Healthcare', description: 'Bengaluru-based health-tech startup achieves unicorn status with latest funding round.', url: '#', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400', publishedAt: '2026-02-28T14:00:00Z', source: { name: 'YourStory', url: '#' } },
    { title: 'Monsoon Arrives Early in Kerala This Year', description: 'IMD predicts above-normal rainfall across South India in coming weeks.', url: '#', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400', publishedAt: '2026-02-28T08:00:00Z', source: { name: 'The Hindu', url: '#' } },
];

/**
 * Get top headlines from India
 */
export async function getTopHeadlines(category = 'general', max = 10) {
    if (isDemoMode()) return demoNews.slice(0, max);

    try {
        const res = await fetch(
            `${BASE_URL}/top-headlines?category=${category}&lang=en&country=in&max=${max}&apikey=${API_KEY}`
        );
        if (!res.ok) throw new Error(`GNews: ${res.status}`);
        const data = await res.json();
        return data.articles || [];
    } catch (error) {
        console.warn('GNews error, using demo:', error.message);
        return demoNews;
    }
}

/**
 * Search news
 */
export async function searchNews(query, max = 10) {
    if (isDemoMode()) {
        return demoNews.filter(n => n.title.toLowerCase().includes(query.toLowerCase()));
    }

    try {
        const res = await fetch(
            `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=${max}&apikey=${API_KEY}`
        );
        if (!res.ok) throw new Error(`GNews: ${res.status}`);
        const data = await res.json();
        return data.articles || [];
    } catch (error) {
        console.warn('GNews error, using demo:', error.message);
        return demoNews;
    }
}

/**
 * Format published date
 */
export function formatNewsDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffH = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    return `${Math.floor(diffH / 24)}d ago`;
}
