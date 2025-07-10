// Service Worker pour MoralChoice PWA
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('moral-choice-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/index.css',
        '/assets/index.js',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        // Mettre en cache les nouvelles ressources
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open('moral-choice-v1').then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Retourner une page d'erreur hors ligne si la requête échoue
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

// Nettoyer les anciens caches lors de l'activation
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['moral-choice-v1'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
