// Arranque: pestañas y primera carga
function tab(q){$('v-q').hidden=!q;$('v-m').hidden=q;$('t-q').setAttribute('aria-selected',q);$('t-m').setAttribute('aria-selected',!q)}
$('t-q').onclick=()=>tab(true);$('t-m').onclick=()=>tab(false);
render();
Ads.init();
