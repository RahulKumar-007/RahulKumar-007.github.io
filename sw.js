const CACHE_NAME = 'portfolioos-v1';

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/js/main.js',
    '/js/Clock.js',
    '/js/WindowManager.js',
    '/js/Dock.js',
    '/js/apps/Browser.js',
    '/js/apps/Finder.js',
    '/js/apps/Mail.js',
    '/js/apps/Terminal.js',
    '/data/portfolio.json',
    '/styles/main.css',
    '/styles/components.css',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/index.html');
            });
        })
    );
});
