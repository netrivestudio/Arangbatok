self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('pembukuan-cache').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './script.js',
        './manifest.json',
        './icon-192.png',
        './icon-512.png'
        // Tidak perlu tambahkan jsPDF karena berasal dari CDN (online)
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Jika ada di cache, gunakan cache
      // Jika tidak ada, ambil dari jaringan
      return response || fetch(event.request).catch(() => {
        // (Opsional) Bisa tambahkan fallback offline page/image di sini
      });
    })
  );
});
