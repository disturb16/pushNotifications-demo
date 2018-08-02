const staticAssets = [
  './',
  './css/app.3550aa63.css',
  './css/uikit.min.js',
  './img/ss.jpg',
  './app.js'
]

const cacheName = 'pwa'

self.addEventListener('install', async event =>{
  const cache = await caches.open(`${cacheName}-static`)
  cache.addAll(staticAssets)
})

self.addEventListener('fetch', event =>{
  const req = event.request
  const url = new URL(req.url)

  // check if request is sent to our site
  // if so, use cached assets
  if(url.origin === location.origin){
    event.respondWith(cacheFirst(req))
  }
  // else
    //else we'll prioritize data from network
    // event.respondWith(networkFirst(req))

})

async function cacheFirst(req){
  const cachedResponse = await caches.match(req)
  return cachedResponse || fetch(req)
}

async function networkFirst(req){
  const cache = await caches.open(`${cacheName}-dynamic`)

  try{
    // obtain data from API requested
    const response = await fetch(req)
    // if sucessfull put a copy of the response in cache and return the response
    cache.put(req, response.clone())
    return response

  }catch(error){
    // if an error happens returns cached data
    return await cache.match(req)
  }
}