const CACHE = 'dchs-sko-blue-v12';
const CORE = [
  './', './index.html', './styles.css', './script.js', './lang.js', './manifest.webmanifest',
  './assets/logo-transparent.png', './assets/logo.png',
  './assets/app-icon-192.png', './assets/app-icon-512.png',
  './assets/children-window.jpg',
  './assets/stove-ru.jpg', './assets/stove-kz.jpg',
  './assets/game-room.svg',
  './assets/fire-rules.jpg', './assets/fire-rules-2.jpg',
  './assets/alarm-ru.jpg', './assets/alarm-kz.jpg',
  './downloads/windows-ru.pdf', './downloads/windows-kz.pdf',
  './downloads/stove-ru.pdf', './downloads/stove-kz.pdf',
  './downloads/fire-ru.pdf', './downloads/fire-kz.pdf',
  './downloads/electric-ru.pdf', './downloads/electric-kz.pdf',
  './downloads/alarm-ru.pdf', './downloads/alarm-kz.pdf'
,
  './assets/alarm-kz.webp',
  './assets/alarm-ru.webp',
  './assets/app-icon-192.webp',
  './assets/app-icon-512.webp',
  './assets/children-window.webp',
  './assets/fire-rules-2.webp',
  './assets/fire-rules.webp',
  './assets/logo-transparent.webp',
  './assets/logo.webp',
  './assets/stove-kz.webp',
  './assets/stove-ru.webp'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML: network first, then cached version for offline use.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Static assets: cache first, then network and cache the fresh response.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
