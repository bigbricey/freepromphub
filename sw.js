// Service Worker for FreePromptHub - 2025 Standards
// Implements modern caching strategies and offline functionality

const CACHE_VERSION = 'v1.2.0';
const STATIC_CACHE = `freeprompthub-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `freeprompthub-dynamic-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/style.css',
  '/css/modern-architecture.css',
  '/css/dark-mode.css',
  '/js/theme-switcher.js',
  '/script.js',
  '/search.js',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.svg',
  // Core prompt categories
  '/prompts/business/',
  '/prompts/coding/',
  '/prompts/content/',
  '/prompts/money/',
  '/prompts/health/',
  '/prompts/relationships/',
  '/prompts/everyday/',
  '/prompts/ai-art/'
];

// Network-first strategy for dynamic content
const NETWORK_FIRST = [
  '/api/',
  '/search',
  '/analytics'
];

// Cache-first strategy for static assets
const CACHE_FIRST = [
  '/css/',
  '/js/',
  '/images/',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.svg',
  '.woff',
  '.woff2'
];

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('freeprompthub-') && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE
            )
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control immediately
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Handle different caching strategies
  if (shouldUseNetworkFirst(request.url)) {
    event.respondWith(networkFirst(request));
  } else if (shouldUseCacheFirst(request.url)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_PAGE);
    }
    
    return new Response('Network error occurred', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Both cache and network failed:', error);
    return new Response('Resource not available', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Stale-while-revalidate strategy (default)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.log('Network request failed:', error);
      return null;
    });
  
  return cachedResponse || await fetchPromise || caches.match(OFFLINE_PAGE);
}

// Helper functions
function shouldUseNetworkFirst(url) {
  return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function shouldUseCacheFirst(url) {
  return CACHE_FIRST.some(pattern => url.includes(pattern));
}

// Handle background sync for offline prompt saves
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-prompts') {
    event.waitUntil(syncPrompts());
  }
});

async function syncPrompts() {
  try {
    // Sync any offline saved prompts when back online
    const savedPrompts = await getOfflineSavedPrompts();
    
    for (const prompt of savedPrompts) {
      await fetch('/api/sync-prompt', {
        method: 'POST',
        body: JSON.stringify(prompt),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    await clearOfflineSavedPrompts();
    console.log('Successfully synced offline prompts');
  } catch (error) {
    console.error('Failed to sync prompts:', error);
    throw error;
  }
}

// Handle push notifications
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: data.url,
    actions: [
      {
        action: 'open',
        title: 'View Prompt',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Utility functions for IndexedDB operations
async function getOfflineSavedPrompts() {
  // Implementation would use IndexedDB to store offline data
  return [];
}

async function clearOfflineSavedPrompts() {
  // Implementation would clear IndexedDB stored data
}