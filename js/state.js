// Estado de la app y guardado local en el dispositivo (localStorage)
let S={mats:[],lines:[],cli:'',job:'',fec:'',mar:15};
let editId=null,photo=null,keepPhoto=null;
try{const r=localStorage.getItem(KEY);if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
if(!S.fec)S.fec=new Date().toISOString().slice(0,10);
function save(){
  try{localStorage.setItem(KEY,JSON.stringify(S))}
  catch(e){toast('No hay espacio en el dispositivo: quita fotos o materiales que no uses')}
}
// Pide al navegador que no borre estos datos por falta de espacio
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
