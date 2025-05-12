const CACHE_NAME = "TurnosApp-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/icono-app38x46.png"
];

// Instalación del service worker y cacheo inicial
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Interceptar fetch y servir desde caché si está disponible
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((oldCache) => caches.delete(oldCache))
      );
    })
  );
});
