/**
 * Service Worker — Offline-first caching for PWA.
 *
 * Cache strategy:
 *   - App shell (HTML, CSS, JS) → Cache First
 *   - API calls → Network First with cache fallback
 *   - Images → Cache First with network update
 */

const CACHE_NAME = 'bharatapp-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/logo.png',
    '/manifest.json',
];

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // API calls: network first, cache fallback
    if (url.pathname.startsWith('/functions/') || url.hostname !== location.hostname) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Static assets: cache first
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return response;
            });
        })
    );
});

// Push notifications (ready for future use)
self.addEventListener('push', (event) => {
    const data = event.data?.json() || { title: 'BharatApp', body: 'New update!' };
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/logo.png',
            badge: '/logo.png',
            vibrate: [200, 100, 200],
            data: data.url || '/',
        })
    );
});

// Notification click → open app
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});
