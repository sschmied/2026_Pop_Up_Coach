const V='popup-coach-v11';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=['cdn.jsdelivr.net','storage.googleapis.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
 if(r.mode==='navigate'&&u.origin===location.origin){   // the app page: newest copy when online, saved copy when offline
  e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put('./index.html',c));return x}).catch(()=>caches.match('./index.html')));return}
 if(u.origin===location.origin||CDN.includes(u.hostname)){   // libraries and the pose model: saved on first use, then work offline
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x})))}});
