const CACHE_NAME = 'l6-2021-cache'
const cacheUrls = [
    '/',
    '/index.html',
    '/utils/back.js',
    '/main.css',
    '/main.js',
    '/components/Board/Board.tmpl.js',
    '/components/Board/Board.js',
    '/components/Board/Board.css',
    '/modules/http.js',
];

this.addEventListener('install', (event) => {
    // задержим обработку события
    // если произойдёт ошибка, serviceWorker не установится
    event.waitUntil(
        // находим в глобальном хранилище Cache-объект с нашим именем
        // если такого не существует, то он будет создан
        caches.open(CACHE_NAME)
            .then((cache) => {
                // загружаем в наш cache необходимые файлы
                return cache.addAll(cacheUrls);
            })
            .catch((err) => {
                console.error('smth went wrong with caches.open: ', err);
            })
    );
});

this.addEventListener('fetch', (event) => {

    /** online first */
    if (navigator.onLine) {
        return fetch(event.request);
    }

    /** cache first */
    event.respondWith(
        // ищем запрашиваемый ресурс в хранилище кэша
        caches
            .match(event.request)
            .then((cachedResponse) => {
                // выдаём кэш, если он есть
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);
            })
            .catch((err) => {
                console.error('smth went wrong with caches.match: ', err);
            })
    );
});
