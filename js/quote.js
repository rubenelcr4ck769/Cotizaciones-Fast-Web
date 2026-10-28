// Cotización: conceptos, totales, copiar y compartir
$('addM').onclick=()=>{
  const m=S.mats.find(x=>x.id===$('selM').value),q=parseFloat($('selQ').value);
  if(!m){toast('Primero agrega materiales en la pestaña Materiales');return}
  if(!(q>0)){toast('La cantidad debe ser mayor a 0');return}
  const ex=S.lines.find(l=>l.mid===m.id);
  if(ex)ex.qty+=q;else S.lines.push({id:uid(),mid:m.id,name:m.name,unit:m.unit,price:m.price,qty:q,img:m.img});
  save();render();
};
$('addL').onclick=()=>{
  const n=$('lab').value.trim(),p=parseFloat($('labP').value);
  if(!n||isNaN(p)||p<0){toast('Escribe el concepto y su monto');return}
  S.lines.push({id:uid(),mid:null,name:n,unit:'servicio',price:p,qty:1});
  $('lab').value='';$('labP').value='';save();render();
};
function setQty(id,v){const l=S.lines.find(x=>x.id===id),q=parseFloat(v);if(l&&q>0){l.qty=q;save();totals();rowTotals()}}
function setPrice(id,v){const l=S.lines.find(x=>x.id===id),p=parseFloat(v);if(l&&p>=0){l.price=p;save();totals();rowTotals()}}
function delL(id){S.lines=S.lines.filter(x=>x.id!==id);save();render()}

['cli','job','fec'].forEach(k=>$(k).oninput=e=>{S[k]=e.target.value;save()});
$('mar').oninput=e=>{S.mar=parseFloat(e.target.value)||0;save();totals()};
$('clr').onclick=()=>{if(S.lines.length&&!confirm('¿Empezar una cotización nueva? Se borran los conceptos actuales (tu catálogo se conserva).'))return;S.lines=[];S.cli='';S.job='';S.fec=new Date().toISOString().slice(0,10);save();render();Ads.tick()};

function calc(){const sub=S.lines.reduce((a,l)=>a+l.qty*l.price,0),mv=sub*S.mar/100;return{sub,mv,tot:sub+mv}}
function totals(){const c=calc();$('sub').textContent=money(c.sub);$('marV').textContent=money(c.mv);$('tot').textContent=money(c.tot)}
function rowTotals(){S.lines.forEach(l=>{const e=document.getElementById('lt-'+l.id);if(e)e.textContent=money(l.qty*l.price)})}
const summary=()=>{
  const c=calc();
  return ['COTIZACIÓN'+(S.job?' – '+S.job:''),S.cli?'Cliente: '+S.cli:'','Fecha: '+S.fec,'',...S.lines.map(l=>'• '+l.name+' ('+l.qty+' '+l.unit+' × '+money(l.price)+') = '+money(l.qty*l.price)),'','Subtotal: '+money(c.sub),'Utilidad '+S.mar+'%: '+money(c.mv),'TOTAL: '+money(c.tot)].filter((x,i)=>x!==''||i>1).join('\n');
};
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Resumen copiado');Ads.tick()}catch(e){toast('No se pudo copiar')}}
$('cpy').onclick=()=>{if(!S.lines.length){toast('Agrega al menos un concepto');return}copyText(summary())};
$('shr').onclick=()=>{if(!S.lines.length){toast('Agrega al menos un concepto');return}sharePdf()};

