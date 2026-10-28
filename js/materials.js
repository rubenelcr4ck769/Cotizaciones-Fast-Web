// Catálogo de materiales: agregar, editar, eliminar y fotos
function resize(file){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const m=200,k=Math.min(1,m/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.75))};im.src=r.result};r.readAsDataURL(file)})}
$('mF').onchange=async e=>{const f=e.target.files[0];photo=f?await resize(f):null};

function resetForm(){editId=null;photo=null;keepPhoto=null;['mN','mU','mP'].forEach(i=>$(i).value='');$('mF').value='';$('mTitle').textContent='Agregar material';$('mS').textContent='Guardar material';$('mC').hidden=true}
$('mC').onclick=resetForm;
$('mS').onclick=()=>{
  const n=$('mN').value.trim(),p=parseFloat($('mP').value);
  if(!n){toast('Escribe el nombre del material');$('mN').focus();return}
  if(isNaN(p)||p<0){toast('Escribe un precio válido');$('mP').focus();return}
  const o={id:editId||uid(),name:n,unit:$('mU').value.trim()||'pza',price:p,img:photo||keepPhoto||null};
  if(editId){S.mats=S.mats.map(m=>m.id===editId?o:m);S.lines=S.lines.map(l=>l.mid===editId?{...l,name:o.name,unit:o.unit,price:o.price}:l);toast('Material actualizado')}
  else{S.mats.push(o);toast('Material agregado')}
  resetForm();save();render();
};
function editM(id){const m=S.mats.find(x=>x.id===id);if(!m)return;editId=id;keepPhoto=m.img;photo=null;$('mN').value=m.name;$('mU').value=m.unit;$('mP').value=m.price;$('mTitle').textContent='Editar material';$('mS').textContent='Guardar cambios';$('mC').hidden=false;$('mN').focus();window.scrollTo({top:0,behavior:'smooth'})}
function delM(id){const m=S.mats.find(x=>x.id===id);if(!m||!confirm('¿Quitar "'+m.name+'" del catálogo? Seguirá en las cotizaciones donde ya lo agregaste.'))return;S.mats=S.mats.filter(x=>x.id!==id);if(editId===id)resetForm();save();render();toast('Material eliminado')}
function rmPhoto(id){S.mats=S.mats.map(m=>m.id===id?{...m,img:null}:m);save();render()}
