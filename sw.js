
const staticCacheName = `offline-cache-v3`;
const assets = [
  './',
  'index.html',
  'Control.FullScreen.css',
  'Control.FullScreen.js',
  'restaurant.html?id=1',
  'restaurant.html?id=2',
  'restaurant.html?id=3',
  'restaurant.html?id=4',
  'restaurant.html?id=5',
  'restaurant.html?id=6',
  'restaurant.html?id=7',
  'restaurant.html?id=8',
  'restaurant.html?id=9',
  'restaurant.html?id=10',
  'restaurant.html?id=11',
  'restaurant.html?id=12',
  'restaurant.html?id=13',
  'restaurant.html?id=14',
  'restaurant.html?id=15',
  'restaurant.html?id=16',
  'restaurant.html?id=17',
  'restaurant.html?id=18',
  'restaurant.html?id=19',
  'restaurant.html?id=20',
  'restaurant.html?id=22',
  './css/styles.css',
  './js/main.js',
  './js/script2.js',
  './js/dbhelper.js',
  './js/restaurant_info.js',
  './data/restaurants.json',
  './img/1.png',
  './img/2.png',
  './img/3.png',
  './img/4.png',
  './img/5.png',
  './img/6.png',
  './img/7.png',
  './img/8.png',
  './img/9.png',
  './img/10.png',
  './img/11.png',
  './img/12.png',
  './img/13.png',
  './img/14.png',
  './img/15.png',
  './img/16.png',
  './img/17.png',
  './img/18.png',
  './img/19.png',
  './img/20.png',
  './img/success.png',
  './img/error.png',
  'https://fonts.googleapis.com/css?family=Barlow+Condensed:300,400,500,600',
  'https://fonts.googleapis.com/css?family=Montserrat:600'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName)
      .then( (cache) => {
        return cache.addAll(assets);
      })
  );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
          .then( (cacheNames) => {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('offline-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                  
                  
                    return caches.delete(cacheName);
                    
                })
            );
          })
    );
});




self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});


