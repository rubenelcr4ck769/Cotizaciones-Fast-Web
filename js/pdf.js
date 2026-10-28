// PDF de la cotización para el cliente: los precios ya incluyen la utilidad, así que todo suma al total.
function buildPdf(){
  const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'});
  const W=210,M=15,f=1+(S.mar||0)/100,r2=n=>Math.round(n*100)/100;
  const rows=S.lines.map(l=>({n:l.name,q:l.qty+' '+l.unit,p:r2(l.price*f),a:r2(l.qty*l.price*f)}));
  const tot=r2(rows.reduce((a,x)=>a+x.a,0));
  const ink=()=>doc.setTextColor(20,38,46);
  let y=0;
  const foot=()=>{doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(130);doc.text('Generado con Cotizaciones Fast Lite',W/2,289,{align:'center'})};
  const tHead=()=>{
    doc.setFillColor(232,236,236);doc.rect(M,y,W-2*M,8,'F');ink();doc.setFont('helvetica','bold');doc.setFontSize(9);
    doc.text('Concepto',M+2,y+5.4);doc.text('Cantidad',135,y+5.4,{align:'right'});doc.text('Precio',163,y+5.4,{align:'right'});doc.text('Importe',W-M-2,y+5.4,{align:'right'});
    y+=8;
  };
  const newPage=()=>{foot();doc.addPage();y=18;tHead()};

  doc.setFillColor(20,38,46);doc.rect(0,0,W,30,'F');
  doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(20);doc.text('COTIZACIÓN',M,14);
  doc.setFont('helvetica','normal');doc.setFontSize(10);if(S.job)doc.text(doc.splitTextToSize(S.job,120)[0],M,22);
  doc.text('Fecha: '+S.fec,W-M,14,{align:'right'});
  doc.setFillColor(240,180,41);doc.rect(0,30,W,2,'F');
  y=44;ink();
  if(S.cli){doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text('Cliente:',M,y);doc.setFont('helvetica','normal');doc.text(doc.splitTextToSize(S.cli,150)[0],M+20,y);y+=10}
  tHead();
  doc.setFont('helvetica','normal');doc.setFontSize(10);
  for(const r of rows){
    const nl=doc.splitTextToSize(r.n,88),h=Math.max(nl.length*5,5)+3;
    if(y+h>262)newPage();
    ink();doc.setFont('helvetica','normal');doc.setFontSize(10);
    doc.text(nl,M+2,y+5);
    doc.text(r.q,135,y+5,{align:'right'});doc.text(money(r.p),163,y+5,{align:'right'});doc.text(money(r.a),W-M-2,y+5,{align:'right'});
    y+=h;doc.setDrawColor(213,220,219);doc.line(M,y-1,W-M,y-1);
  }
  if(y>248)newPage();
  y+=6;doc.setFillColor(240,180,41);doc.rect(105,y,W-M-105,13,'F');ink();
  doc.setFont('helvetica','bold');doc.setFontSize(12);doc.text('TOTAL',109,y+8.6);
  doc.setFontSize(14);doc.text(money(tot),W-M-3,y+8.9,{align:'right'});
  foot();
  const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,30);
  return{doc,name:'Cotizacion_'+(slug(S.cli||S.job||'')||'obra')+'_'+S.fec+'.pdf'};
}
async function sharePdf(){
  let b;try{b=buildPdf()}catch(e){toast('No se pudo crear el PDF');return}
  const {doc,name}=b,fs=plugin('Filesystem'),sh=plugin('Share');
  try{
    if(fs&&sh){   // app de Android: guarda el PDF y abre el menú de compartir
      const r=await fs.writeFile({path:name,data:doc.output('datauristring').split(',')[1],directory:'CACHE'});
      await sh.share({title:'Cotización',text:'Cotización'+(S.job?' – '+S.job:''),files:[r.uri],dialogTitle:'Compartir cotización'});
      Ads.tick();return;
    }
    const file=new File([doc.output('blob')],name,{type:'application/pdf'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Cotización'});return}
    doc.save(name);toast('PDF descargado');
  }catch(e){if(e&&/cancel|abort/i.test((e.name||'')+(e.message||'')))return;toast('No se pudo compartir el PDF')}
}
