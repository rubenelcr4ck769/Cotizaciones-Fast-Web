// Pintado de pantalla y eventos delegados
function render(){
  $('cli').value=S.cli;$('job').value=S.job;$('fec').value=S.fec;$('mar').value=S.mar;
  $('count').textContent=S.mats.length+' materiales · '+S.lines.length+' conceptos';
  const sv=$('selM').value;
  $('selM').innerHTML=S.mats.length?S.mats.map(m=>'<option value="'+m.id+'">'+esc(m.name)+' — '+money(m.price)+'/'+esc(m.unit)+'</option>').join(''):'<option value="">Sin materiales todavía</option>';
  if(sv&&S.mats.some(m=>m.id===sv))$('selM').value=sv;
  $('lines').innerHTML=S.lines.length?S.lines.map(l=>'<div class="item"><div class="grow"><div class="name">'+esc(l.name)+'</div><div class="meta">'+esc(l.unit)+'</div></div>'
    +'<label>Cant.<input class="qty" type="number" min="0" step="any" value="'+l.qty+'" data-q="'+l.id+'"></label>'
    +'<label>Precio<input class="qty" style="width:100px" type="number" min="0" step="any" value="'+l.price+'" data-p="'+l.id+'"></label>'
    +'<div class="num name" style="min-width:90px" id="lt-'+l.id+'">'+money(l.qty*l.price)+'</div>'
    +'<button class="btn del sm noprint" data-dl="'+l.id+'" aria-label="Quitar '+esc(l.name)+'">Quitar</button></div>').join(''):'<p class="empty">Aún no hay conceptos. Agrega materiales o mano de obra para armar la cotización.</p>';
  $('mList').innerHTML=S.mats.length?S.mats.map(m=>'<div class="item">'+(m.img?'<img class="thumb" alt="" src="'+m.img+'">':'<div class="thumb">sin foto</div>')
    +'<div class="grow"><div class="name">'+esc(m.name)+'</div><div class="meta">'+money(m.price)+' por '+esc(m.unit)+'</div></div>'
    +(m.img?'<button class="btn ghost sm" data-rp="'+m.id+'">Quitar foto</button>':'')
    +'<button class="btn ghost sm" data-em="'+m.id+'">Editar</button><button class="btn del sm" data-dm="'+m.id+'">Eliminar</button></div>').join(''):'<p class="empty">Tu catálogo está vacío. Agrega arriba el primer material con su precio.</p>';
  totals();
}
document.addEventListener('click',e=>{const d=e.target.dataset;if(d.em)editM(d.em);else if(d.dm)delM(d.dm);else if(d.dl)delL(d.dl);else if(d.rp)rmPhoto(d.rp)});
document.addEventListener('input',e=>{const d=e.target.dataset;if(d.q)setQty(d.q,e.target.value);else if(d.p)setPrice(d.p,e.target.value)});
