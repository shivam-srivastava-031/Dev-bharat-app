/**
 * Offline Cache — IndexedDB-backed cache for instant feed loading.
 *
 * Strategy: "Stale-While-Revalidate"
 *   1. On load: immediately show cached feed from IndexedDB
 *   2. In background: fetch fresh data from API
 *   3. When fresh data arrives: update UI + cache
 *
 * This gives users instant loading even on poor networks or offline.
 */

const DB_NAME = 'bharatapp_cache';
const DB_VERSION = 1;
const STORES = {
    feed: 'feed_cache',
    videos: 'video_cache',
    search: 'search_cache',
    weather: 'weather_cache',
    meta: 'cache_meta',
};

// ===== IndexedDB helpers =====

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            Object.values(STORES).forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'key' });
                }
            });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function putItem(storeName, key, data) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.put({
                key,
                data,
                timestamp: Date.now(),
                expiry: Date.now() + 24 * 60 * 60 * 1000, // 24h expiry
            });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.warn('Cache write error:', err.message);
    }
}

async function getItem(storeName, key) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = () => {
                const result = request.result;
                if (result && result.expiry > Date.now()) {
                    resolve(result);
                } else {
                    resolve(null); // expired
                }
            };
            request.onerror = () => reject(request.error);
        });
    } catch (err) {
        console.warn('Cache read error:', err.message);
        return null;
    }
}

async function clearStore(storeName) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.warn('Cache clear error:', err.message);
    }
}

// ===== Public API =====

/**
 * Cache the ranked feed.
 */
export async function cacheFeed(filterKey, posts) {
    await putItem(STORES.feed, `feed_${filterKey}`, posts);
    if (import.meta.env.DEV) console.log(`💾 Cached ${posts.length} feed items [${filterKey}]`);
}

/**
 * Get cached feed. Returns null if no cache or expired.
 */
export async function getCachedFeed(filterKey) {
    const cached = await getItem(STORES.feed, `feed_${filterKey}`);
    if (cached) {
        const ageMin = Math.round((Date.now() - cached.timestamp) / 60000);
        if (import.meta.env.DEV) console.log(`💾 Feed cache hit [${filterKey}], age: ${ageMin}min`);
        return { data: cached.data, timestamp: cached.timestamp, ageMinutes: ageMin };
    }
    return null;
}

/**
 * Cache video data.
 */
export async function cacheVideos(videos) {
    await putItem(STORES.videos, 'reels', videos);
}

/**
 * Get cached videos.
 */
export async function getCachedVideos() {
    const cached = await getItem(STORES.videos, 'reels');
    return cached ? cached.data : null;
}

/**
 * Cache search page data (weather, cricket, news).
 */
export async function cacheSearchData(data) {
    await putItem(STORES.search, 'search_page', data);
}

/**
 * Get cached search data.
 */
export async function getCachedSearchData() {
    const cached = await getItem(STORES.search, 'search_page');
    return cached ? cached.data : null;
}

/**
 * Cache weather data with shorter expiry (1 hour).
 */
export async function cacheWeather(city, data) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORES.weather, 'readwrite');
            const store = tx.objectStore(STORES.weather);
            store.put({
                key: `weather_${city}`,
                data,
                timestamp: Date.now(),
                expiry: Date.now() + 60 * 60 * 1000, // 1h for weather
            });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.warn('Weather cache error:', err.message);
    }
}

/**
 * Get cached weather.
 */
export async function getCachedWeather(city) {
    const cached = await getItem(STORES.weather, `weather_${city}`);
    return cached ? cached.data : null;
}

/**
 * Get cache statistics.
 */
export async function getCacheStats() {
    try {
        const db = await openDB();
        const stats = {};
        for (const [name, storeName] of Object.entries(STORES)) {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const countReq = store.count();
            stats[name] = await new Promise(r => { countReq.onsuccess = () => r(countReq.result); });
        }
        return stats;
    } catch (err) {
        return {};
    }
}

/**
 * Clear all caches.
 */
export async function clearAllCaches() {
    await Promise.all(Object.values(STORES).map(store => clearStore(store)));
    if (import.meta.env.DEV) console.log('💾 All caches cleared');
}
