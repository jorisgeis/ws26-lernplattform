// Offline support for StudyOS WS26 · Native (registered as './sw.js').
// Network-first for same-origin GETs so updates appear immediately; cache fallback when offline.
// Service workers only run in secure contexts: https://… or http://localhost.

const CACHE = 'studyos-native-v2';
const PRECACHE = [
  './',
  './index.html',
  './css/style.css',
  './css/diagrams.css',
  './js/app.js',
  './js/core.js',
  './js/data/courses.js',
  './js/data/gdp1.js',
  './js/data/gdp2.js',
  './js/data/ics.js',
  './js/data/english.js',
  './js/engine/sm2.js',
  './js/engine/store.js',
  './js/engine/diagrams.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || Response.error()))
  );
});
