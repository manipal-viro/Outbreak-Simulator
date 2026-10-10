const VERSION='v1'; // bump on each deploy so users see the "Update now" banner
const CACHE='ois-'+VERSION;
const SHELL=['./','index.html','manifest.webmanifest','firebase-config.js','data/cases.json','data/case-01.json','assets/images/miv-logo.jpg','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('ois-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
// Network first: always try the network so edits go live; fall back to cache when offline.
const netFirst=async req=>{const c=await caches.open(CACHE);try{const r=await fetch(req.mode==='navigate'?req.url:req,{cache:'no-store'});if(r.ok)c.put(req,r.clone());return r}catch(e){return(await c.match(req,{ignoreSearch:true}))||(await c.match('index.html'))||Response.error()}};
// Stale-while-revalidate for images and fonts
const swr=async req=>{const c=await caches.open(CACHE),hit=await c.match(req,{ignoreSearch:true});const p=fetch(req).then(r=>{if(r.ok)c.put(req,r.clone());return r}).catch(()=>hit);return hit||p};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){if(r.mode==='navigate'||/\.(html|json|js|webmanifest)$/.test(u.pathname)||u.pathname.endsWith('/'))return e.respondWith(netFirst(r));return e.respondWith(swr(r))}
 if(['cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname))e.respondWith(swr(r))});
