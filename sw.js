const A='ffx-app-v3',C='ffx-v2',ON='ffx-on',CORE=['./','index.html','database.js','manifest.webmanifest','icon-192.png','icon-512.png'],MAXT=4000;
const TILE=/arcgisonline|arcgis\.com|tilecache\.rainviewer|\.(png|jpe?g|webp|pbf)(\?|$)/i,SKIP=/router\.project-osrm|overpass-api|nominatim|open-meteo|inmet\.gov|api\.rainviewer|generate_204|google\.com|wa\.me/i,STAT=/unpkg\.com|fonts\.g/i;
const ok=x=>x&&(x.ok||x.type==='opaque'),grab=async u=>{try{return await fetch(u,{cache:'no-store'})}catch{try{return await fetch(u,{mode:'no-cors'})}catch{return null}}};
const trim=async c=>{const k=await c.keys();if(k.length>MAXT)await Promise.all(k.slice(0,k.length-MAXT+300).map(x=>c.delete(x)))};
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil((async()=>{const c=await caches.open(A),b=new URL('./',self.registration.scope).href,U=new Set(CORE.map(u=>new URL(u,b).href)),h=await grab(b);
 if(h&&h.type!=='opaque'&&h.ok){const t=await h.clone().text();for(const m of t.matchAll(/(?:src|href)="(https?:[^"]+)"/g))if(!SKIP.test(m[1]))U.add(m[1].replace(/&amp;/g,'&'));await c.put(b,h)}
 for(const u of [...U])if(/fonts\.googleapis/.test(u)){const r=await grab(u);if(r&&r.type!=='opaque'&&r.ok){const t=await r.clone().text();for(const m of t.matchAll(/url\((https:[^)]+)\)/g))U.add(m[1]);await c.put(u,r)}}
 await Promise.all([...U].map(async u=>{if(await c.match(u))return;const r=await grab(u);if(ok(r))await c.put(u,r)}))})())});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('ffx-app')&&k!==A)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||!/^https?:/.test(r.url)||SKIP.test(r.url))return;
 e.respondWith((async()=>{const u=new URL(r.url),same=u.origin===location.origin;
  if(!same&&TILE.test(r.url)&&!STAT.test(u.host)){if(!(await caches.has(ON)))return fetch(r);const c=await caches.open(C),m=await c.match(r),f=fetch(r).then(x=>{if(ok(x)){c.put(r,x.clone());if(Math.random()<.02)trim(c)}return x}).catch(()=>m);return m||f}
  const c=await caches.open(A);if(!same&&STAT.test(u.host)){const m=await c.match(r);if(m)return m}
  try{const x=await fetch(r);if(ok(x)&&(same||STAT.test(u.host)))c.put(r,x.clone());return x}
  catch(err){const s=self.registration.scope,m=(await c.match(r,{ignoreSearch:same}))||(r.mode==='navigate'&&((await c.match(new URL('./',s).href))||(await c.match(new URL('index.html',s).href))));if(m)return m;throw err}})())});
