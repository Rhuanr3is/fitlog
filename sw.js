const CACHE = 'fitlog-v1';
const ASSETS = [
  '/fitlog/index.html',
  '/fitlog/manifest.json',
  '/fitlog/icon-193.png',
  '/fitlog/icon-512.png'
];

// Instala e cacheia os arquivos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Limpa caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: serve do cache, cai na rede se não tiver
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
