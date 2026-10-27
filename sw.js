const CACHE='japan-2026-v51-offline';
const CORE=['./','./index.html','./manifest.webmanifest'];
const ASSETS=["./index.html", "./manifest.webmanifest", "./japan_2026_logo.png", "./hakone-booking-new.png", "./osaka-booking-new.png", "./seoul-hotel.pdf", "./tokyo-hotel.pdf", "./hakone-hotel.pdf", "./matsumoto-hotel.pdf", "./takayama-hotel.pdf", "./kanazawa-hotel.pdf", "./kyoto-hotel.pdf", "./hiroshima-hotel.pdf", "./osaka-hotel.pdf", "./toyota-car-reservation.pdf", "./seoul-airport-chauffeur.pdf", "./osaka-airport-chauffeur.pdf"];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(CORE);
  await Promise.allSettled(ASSETS.map(async path=>{
    const response=await fetch(path,{cache:'reload'});
    if(response.ok)await cache.put(path,response);
  }));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('japan-2026-v')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req,{ignoreSearch:true});
  if(cached)return cached;
  try{
   const response=await fetch(req);
   if(response.ok)await cache.put(req,response.clone());
   return response;
  }catch(err){
   if(req.mode==='navigate')return (await cache.match('./index.html'))||Response.error();
   return Response.error();
  }
 })());
});
