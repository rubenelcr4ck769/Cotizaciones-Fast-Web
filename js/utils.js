// Utilidades compartidas
const $=id=>document.getElementById(id);
const KEY='cotizador-v1';
const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n||0);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),1800)}
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

// Plugins nativos de Capacitor (solo existen dentro de la app de Android).
// Hay que registrarlos con registerPlugin: "Capacitor.Plugins.X" no existe si no se usa un empaquetador.
const _pl={};
function plugin(n){
  const C=window.Capacitor;
  if(!C||typeof C.registerPlugin!=='function'||(typeof C.isNativePlatform==='function'&&!C.isNativePlatform()))return null;
  try{return _pl[n]||(_pl[n]=C.registerPlugin(n))}catch(e){return null}
}
