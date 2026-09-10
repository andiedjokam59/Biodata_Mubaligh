const CACHE_NAME = 'muballigh-v1'; // <-- Ubah versi ini setiap ada update baru!
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo insan qurany.png'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Paksa Service Worker baru langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event (Penghapusan Cache Lama)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Hapus memori lama
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Network First agar selalu mengecek server utama dulu)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});