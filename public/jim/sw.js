const CACHE_NAME = 'fitflow-v1.0.0'
const STATIC_CACHE = 'fitflow-static-v1'
const DYNAMIC_CACHE = 'fitflow-dynamic-v1'

// Risorse da cacheare immediatamente
const STATIC_ASSETS = [
  '/jim/',
  '/jim/icon-192.png',
  '/jim/icon-512.png',
  '/jim/apple-touch-icon.png',
  '/jim/manifest.json'
]

// Strategie di caching
const CACHE_STRATEGIES = {
  // Cache first per risorse statiche
  STATIC: 'cache-first',
  // Network first per API e dati dinamici
  DYNAMIC: 'network-first',
  // Stale while revalidate per risorse che cambiano raramente
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
}

// Install event - cache delle risorse statiche
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Static assets cached successfully')
        return self.skipWaiting()
      })
  )
})

// Activate event - pulizia delle cache vecchie
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - gestione delle richieste
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Gestione specifica per iPhone
  if (request.headers.get('save-data')) {
    // Modalità risparmio dati - usa solo cache
    event.respondWith(cacheFirst(request))
    return
  }

  // Strategia per risorse statiche
  if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Strategia per API e dati dinamici
  if (url.pathname.includes('/api/') || url.pathname.includes('/data/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Strategia per pagine HTML
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Default: network first
  event.respondWith(networkFirst(request))
})

// Strategia Cache First
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Fallback per offline
    return new Response('Offline - Contenuto non disponibile', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// Strategia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fallback offline
    return new Response('Offline - Contenuto non disponibile', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// Strategia Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  // Ritorna subito la versione cached se disponibile
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    // Ignora errori di rete
  })
  
  return cachedResponse || fetchPromise
}

// Gestione push notifications per iPhone
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/jim/icon-192.png',
      badge: '/jim/icon-192.png',
      vibrate: [200, 100, 200, 100, 200],
      data: data.data,
      actions: [
        {
          action: 'start_workout',
          title: 'Inizia Allenamento',
          icon: '/jim/icon-192.png'
        },
        {
          action: 'view_progress',
          title: 'Vedi Progressi',
          icon: '/jim/icon-192.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Gestione click su notifiche
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'start_workout') {
    event.waitUntil(
      clients.openWindow('/jim/?screen=workout')
    )
  } else if (event.action === 'view_progress') {
    event.waitUntil(
      clients.openWindow('/jim/?screen=progress')
    )
  } else {
    event.waitUntil(
      clients.openWindow('/jim/')
    )
  }
})

// Gestione sync in background per iPhone
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sincronizza dati offline
      syncOfflineData()
    )
  }
})

// Funzione per sincronizzare dati offline
async function syncOfflineData() {
  try {
    // Sincronizza workout completati
    const cache = await caches.open(DYNAMIC_CACHE)
    const requests = await cache.keys()
    
    for (const request of requests) {
      if (request.url.includes('/workout/')) {
        try {
          await fetch(request, { method: 'POST' })
          await cache.delete(request)
        } catch (error) {
          console.log('Failed to sync workout data:', error)
        }
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error)
  }
}

// Gestione errori globali
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error)
})

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason)
})
