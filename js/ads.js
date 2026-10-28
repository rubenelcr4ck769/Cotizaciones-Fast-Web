// Anuncios (AdMob). Solo actúan dentro de la app de Android; en el navegador no hacen nada.
// Banner fijo abajo + un anuncio de pantalla completa de vez en cuando, nunca mientras escribes.
const Ads=(()=>{
  const C=window.ADS_CONFIG||{};
  const AD=()=>plugin('AdMob');
  const EVERY=3,GAP=3*60*1000;   // intersticial: cada 3 acciones completadas y con 3 minutos de espera mínimo
  let ready=false,actions=0,last=Date.now(),interReady=false,log=[];
  const setH=h=>document.documentElement.style.setProperty('--ad-h',(h||0)+'px');
  // El estado de los anuncios se ve en pantalla solo con "testing": true o "debug": true en admob.json (para diagnosticar)
  const say=t=>{log.push(t);log=log.slice(-4);const e=document.getElementById('adStatus');if(e&&(C.testing||C.debug)){e.hidden=false;e.textContent='Anuncios: '+log.join(' → ')}};
  const err=e=>e&&typeof e==='object'?((e.code!==undefined?'['+e.code+'] ':'')+(e.message||JSON.stringify(e))):String(e);
  async function prepare(){try{await AD().prepareInterstitial({adId:C.interstitialId,isTesting:!!C.testing})}catch(e){interReady=false;say('intersticial: '+err(e))}}
  async function init(){
    const a=AD();
    if(!a||!C.appId){say('solo funcionan dentro de la app instalada');return}
    try{
      say('consentimiento');
      // Consentimiento (UMP de Google): obligatorio en el Espacio Económico Europeo y Reino Unido.
      // Si todavía no creaste el mensaje en AdMob, no se bloquea la app: se sigue sin él (Google limita los anuncios en Europa).
      let ci={canRequestAds:true};
      try{
        ci=await a.requestConsentInfo();
        if(ci.status==='REQUIRED'&&ci.isConsentFormAvailable)ci=await a.showConsentForm();
        if(ci.privacyOptionsRequirementStatus==='REQUIRED'){const b=document.getElementById('privBtn');if(b){b.hidden=false;b.onclick=()=>a.showPrivacyOptionsForm()}}
      }catch(e){ci={canRequestAds:true};say('sin mensaje de consentimiento en AdMob, se continúa')}
      if(ci.canRequestAds===false){say('sin consentimiento para anuncios');return}
      say('iniciando');
      await a.initialize({initializeForTesting:!!C.testing});
      await a.addListener('bannerAdSizeChanged',s=>setH(s.height));
      await a.addListener('bannerAdLoaded',()=>say('banner cargado'));
      await a.addListener('bannerAdFailedToLoad',e=>{setH(0);say('banner falló '+err(e))});
      await a.addListener('interstitialAdLoaded',()=>{interReady=true;say('intersticial listo')});
      await a.addListener('interstitialAdFailedToLoad',e=>{interReady=false;say('intersticial falló '+err(e))});
      await a.addListener('interstitialAdDismissed',()=>{interReady=false;last=Date.now();prepare()});
      ready=true;
      await a.showBanner({adId:C.bannerId,adSize:'ADAPTIVE_BANNER',position:'BOTTOM_CENTER',margin:0,isTesting:!!C.testing});
      prepare();
    }catch(e){setH(0);say('error '+err(e))}
  }
  // Se llama después de una acción terminada (compartir, copiar, nueva cotización)
  async function tick(){
    const a=AD();if(!ready||!a)return;
    actions++;
    if(actions>=EVERY&&interReady&&Date.now()-last>GAP){actions=0;last=Date.now();try{await a.showInterstitial()}catch(e){}}
  }
  return{init,tick};
})();
