const C='ffx-v2',ON='ffx-on';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||!/^https?:/.test(r.url))return;
 e.respondWith((async()=>{if(!(await caches.has(ON)))return fetch(r);
  const u=new URL(r.url),c=await caches.open(C),tile=/arcgisonline|arcgis\.com|rainviewer|\.(png|jpe?g|webp|pbf)(\?|$)/i.test(r.url);
  if(tile){const m=await c.match(r);const f=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}).catch(()=>m);return m||f}
  try{const x=await fetch(r);if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}
  catch(err){const m=await c.match(r,{ignoreSearch:u.origin===location.origin});if(m)return m;throw err}})())});
