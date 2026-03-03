// Unsplash API Service — Free: 50 req/hr
// https://unsplash.com/developers

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const BASE_URL = 'https://api.unsplash.com';
const isDemoMode = () => !ACCESS_KEY || ACCESS_KEY === 'your_unsplash_access_key';

// Demo photos for when API key is not configured
const demoPhotos = [
    { id: 'd1', urls: { regular: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', thumb: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200' }, alt_description: 'Taj Mahal, India', user: { name: 'Unsplash', username: 'unsplash' }, likes: 1200 },
    { id: 'd2', urls: { regular: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800', thumb: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=200' }, alt_description: 'Indian street food', user: { name: 'Unsplash', username: 'unsplash' }, likes: 890 },
    { id: 'd3', urls: { regular: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?w=800', thumb: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?w=200' }, alt_description: 'Jaipur, Rajasthan', user: { name: 'Unsplash', username: 'unsplash' }, likes: 2300 },
    { id: 'd4', urls: { regular: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', thumb: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200' }, alt_description: 'Delhi cityscape', user: { name: 'Unsplash', username: 'unsplash' }, likes: 567 },
    { id: 'd5', urls: { regular: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', thumb: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200' }, alt_description: 'Mumbai skyline', user: { name: 'Unsplash', username: 'unsplash' }, likes: 3100 },
    { id: 'd6', urls: { regular: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800', thumb: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=200' }, alt_description: 'Varanasi ghats', user: { name: 'Unsplash', username: 'unsplash' }, likes: 1800 },
];

/**
 * Search photos from Unsplash
 */
export async function searchPhotos(query = 'India', page = 1, perPage = 10) {
    if (isDemoMode()) return { results: demoPhotos, total: demoPhotos.length };

    try {
        const res = await fetch(
            `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`,
            { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
        );
        if (!res.ok) throw new Error(`Unsplash: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.warn('Unsplash error, using demo:', error.message);
        return { results: demoPhotos, total: demoPhotos.length };
    }
}

/**
 * Get random India-themed photos
 */
export async function getRandomPhotos(count = 6) {
    if (isDemoMode()) return demoPhotos.slice(0, count);

    try {
        const res = await fetch(
            `${BASE_URL}/photos/random?query=India&count=${count}&orientation=landscape`,
            { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
        );
        if (!res.ok) throw new Error(`Unsplash: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.warn('Unsplash error, using demo:', error.message);
        return demoPhotos.slice(0, count);
    }
}

/**
 * Get photos for feed posts
 */
export async function getFeedPhotos(topic = 'Indian culture', page = 1) {
    return searchPhotos(topic, page, 8);
}
