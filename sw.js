const CACHE_NAME = 'aurionxi-shell-v1';
const OFFLINE_URL = '/?source=pwa';
const ASSETS = [
  OFFLINE_URL,
  '/',
  // important visual assets - add or remove as needed
  'https://blogger.googleusercontent.com/img/a/AVvXsEgaSVijT0Jf8hmHvC0eE4dlWD3VoRV_hdw4hiIT5F9mE-EP2I_hIJKixFXM_5or94mJeuGOjZDrKytHH0yiIVvUCl3F_2abxa4ZV-Uw1aivLj15KSu_-7Vcl93z-CFjY3mTAhP2jEWaWEnRjGpCC2CxRjUOpXbK72toxiIrO0XXcV6DuYNUu5oBX-t-4zc',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgwcC81_jQooTsAzC7wyj-n0PVvZY7oSZF8U9QHzrplwQZDxnOh9vICgTrhGN2awbxIDX8jv8EU5F84m4cNF6M0AbMXwaBwQ7D-2A0C1exYt9j1bj4c-oBq8jXutxxPIHD5Q93eITuHaRhFzaXbKHjuMGipLYw86uDTv7NwIjGoLO9OMIgtPT6i_c24un8/s320/aurionxi_favicon_512x512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS).catch(()=>{}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy).catch(()=>{}));
        return response;
      }).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
