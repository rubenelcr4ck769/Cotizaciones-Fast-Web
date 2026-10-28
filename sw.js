// Permite usar la app sin internet. Si cambias archivos, sube el número de V para que se actualicen.
const V='cotizaciones-web-v1';
const FILES=[
  './',
  'index.html',
  'manifest.webmanifest',
  'css/styles.css',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'js/pdf.js',
  'js/ads.js',
  'js/ads-config.js',
  'js/render.js',
  'js/materials.js',
  'js/utils.js',
  'js/state.js',
  'js/main.js',
  'js/quote.js',
  'js/vendor/capacitor.js',
  'js/vendor/jspdf.umd.min.js',
  'fonts/barlow-latin-400-normal.woff2',
  'fonts/barlow-latin-500-normal.woff2',
  'fonts/barlow-latin-600-normal.woff2',
  'fonts/barlow-semi-condensed-latin-600-normal.woff2',
  'fonts/barlow-semi-condensed-latin-700-normal.woff2'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Primero internet (siempre la versión más nueva); si no hay conexión, usa lo guardado
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
