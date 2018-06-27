
self.addEventListener('install', function (event) {
  console.log("[ServiceWorker] Installed");
});

self.addEventListener('activate', function (event) {
  console.log("[ServiceWorker] Installed");
});

self.addEventListener('fetch', function (event) {
  console.log("[ServiceWorker] Fetching", event.request.url);
  
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

