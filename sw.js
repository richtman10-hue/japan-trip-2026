const CACHE='japan-2026-v20';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate'||e.request.destination==='document'){e.respondWith(fetch(e.request,{cache:'no-store'}));return;}e.respondWith(fetch(e.request));});
