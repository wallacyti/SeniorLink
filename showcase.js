/* SeniorLink exhibition: local assets, visual scenes and a pauseable loop. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#${name}"/></svg>`;
  const stage = $('#showcase');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 8500;
  let current = 0, elapsed = 0, lastFrame = 0, animationFrame = 0;
  let playing = !reducedMotion.matches, exhibition = false, ownsFullscreen = false;
  let hideTimer = 0, messageTimer = 0, wakeLock = null;
  // Each viewBox frames a screen in the unchanged 1434 × 1097 MVP banner.
  // The photo's device has different proportions; the full screen fits its display.
  const scenes = [
    {name:'Splash Screen',crop:[24,58,168,472],heading:'Cuidado hoje.<br><em>Liberdade amanhã.</em>',description:'Mais conexão para todas as fases da vida.',icon:'heart',tone:'connection'},
    {name:'Onboarding 1',crop:[219,58,160,471],heading:'Cuidado que aproxima.<br><em>Em todas as fases.</em>',description:'Cuidado hoje, mais liberdade amanhã.',icon:'users',tone:'connection'},
    {name:'Onboarding 2',crop:[403,58,159,471],heading:'Por perto.<br><em>Mesmo de longe.</em>',description:'Localização em tempo real.',icon:'pin',tone:'location'},
    {name:'Onboarding 3',crop:[587,58,152,471],heading:'Pequenos cuidados.<br><em>Grandes diferenças.</em>',description:'Lembretes que fazem a diferença.',icon:'bell',tone:'reminders'},
    {name:'Login',crop:[766,58,148,471],heading:'Bem-vindo<br><em>de volta.</em>',description:'Sua conexão com o cuidado começa aqui.',icon:'user',tone:'connection'},
    {name:'Cadastro',crop:[938,58,148,471],heading:'Uma conta.<br><em>Mais conexão.</em>',description:'Pessoa idosa e responsável, conectados pelo cuidado.',icon:'users',tone:'connection'},
    {name:'Tela Inicial',crop:[1111,58,138,471],heading:'Olá, Maria!<br><em>Que bom ter você aqui.</em>',description:'Os cuidados do dia, em um só lugar.',icon:'home',tone:'autonomy'},
    {name:'Perfil do Idoso',crop:[1272,58,141,471],heading:'Sua história.<br><em>Seu cuidado.</em>',description:'As informações importantes, sempre por perto.',icon:'user',tone:'autonomy'},
    {name:'Localização',crop:[27,603,158,434],heading:'Por perto.<br><em>Mesmo de longe.</em>',description:'Uma conexão que acompanha quem você ama.',icon:'pin',tone:'location'},
    {name:'Lembretes',crop:[206,601,166,437],heading:'No seu tempo.<br><em>Na hora certa.</em>',description:'Os pequenos cuidados também importam.',icon:'bell',tone:'reminders'},
    {name:'Adicionar Lembrete',crop:[394,603,162,435],heading:'Cada cuidado<br><em>tem seu momento.</em>',description:'Lembretes para acompanhar a rotina.',icon:'clock',tone:'reminders'},
    {name:'Emergência (SOS)',crop:[580,604,157,434],heading:'Um toque.<br><em>Alguém por perto.</em>',description:'Sua rede de apoio, quando mais precisar.',icon:'phone',tone:'support'},
    {name:'Aprender',crop:[767,604,142,433],heading:'Aprender conecta.<br><em>Conhecer liberta.</em>',description:'Um passo de cada vez. No seu ritmo.',icon:'book',tone:'learning'},
    {name:'Contatos de Confiança',crop:[929,602,151,436],heading:'Conexões<br><em>em que confiar.</em>',description:'Pessoas que podem ajudar, sempre por perto.',icon:'users',tone:'connection'},
    {name:'Configurações',crop:[1102,602,148,436],heading:'Do seu jeito.<br><em>No seu ritmo.</em>',description:'Uma experiência pensada para você.',icon:'shield',tone:'autonomy'},
    {name:'Boas-vindas',crop:[1269,601,145,437],heading:'Tudo pronto!<br><em>Vamos começar.</em>',description:'Agora você faz parte do SeniorLink.',icon:'heart',tone:'connection'}
  ];
  const navigation = $('.scene-navigation');
  navigation.innerHTML = scenes.map((scene,index) => `<button class="scene-button" data-scene="${index}" aria-label="Tela ${index + 1}: ${scene.name}" title="${index + 1}. ${scene.name}"><span class="scene-track"><i></i></span><span class="scene-button-label">${String(index + 1).padStart(2,'0')}</span></button>`).join('');
  const sceneButtons = [...navigation.querySelectorAll('.scene-button')];

  function originalScreen(scene) {
    return `<svg class="mvp-screen" viewBox="${scene.crop.join(' ')}" preserveAspectRatio="none" aria-hidden="true"><image href="./assets/mvp-banner.jpeg" width="1434" height="1097"/></svg>`;
  }

  function fitDisplay() {
    const viewport = $('#display-viewport');
    // Width before transforms keeps the HTML precisely aligned to the original photo.
    $('#display-canvas').style.setProperty('--phone-scale', String(viewport.clientWidth / 406));
  }
  new ResizeObserver(fitDisplay).observe($('#display-viewport'));
  fitDisplay();

  function animateElement(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }
  function renderScene(index, animate = true) {
    current = (index + scenes.length) % scenes.length;
    elapsed = 0;
    lastFrame = 0;
    const scene = scenes[current];
    stage.dataset.scene = String(current);
    stage.dataset.tone = scene.tone;
    $('#scene-eyebrow').textContent = 'MAIS CONEXÃO PARA TODAS AS FASES DA VIDA';
    $('#scene-heading').innerHTML = scene.heading;
    $('#scene-description').textContent = scene.description;
    $('#scene-signature').textContent = 'SENIORLINK. TECNOLOGIA QUE APROXIMA.';
    $('#floating-icon').innerHTML = icon(scene.icon);
    $('#floating-kicker').textContent = `TELA ${String(current + 1).padStart(2,'0')} DO MVP`;
    $('#floating-title').textContent = scene.name;
    $('#rail-label').textContent = scene.name.toUpperCase();
    $('#rail-number').textContent = `${String(current + 1).padStart(2,'0')} / ${scenes.length}`;
    $('#handheld').setAttribute('aria-label',`Celular na mão mostrando ${scene.name.toLowerCase()} no SeniorLink. Tela original do banner do MVP. Demonstração visual.`);
    $('#scene-announcement').textContent = `Tela ${current + 1} de ${scenes.length}: ${scene.name}. ${scene.description}`;
    sceneButtons.forEach((button,i) => {
      button.classList.toggle('active',i === current);
      if (i === current) button.setAttribute('aria-current','true'); else button.removeAttribute('aria-current');
      button.style.setProperty('--progress','0');
    });
    $('#current-screen-label').textContent = `${String(current + 1).padStart(2,'0')} / ${scenes.length} · ${scene.name}`;
    const selected = sceneButtons[current];
    navigation.scrollLeft = selected.offsetLeft - navigation.offsetLeft - (navigation.clientWidth - selected.clientWidth) / 2;
    const container = $('#screen-content');
    [...container.children].forEach(layer => { layer.classList.remove('shown'); layer.classList.add('leaving'); });
    const layer = document.createElement('div');
    layer.className = 'screen-layer mvp-layer';
    layer.innerHTML = originalScreen(scene);
    container.append(layer);
    if (!animate || reducedMotion.matches) layer.classList.add('shown');
    else { void layer.offsetWidth; layer.classList.add('shown'); }
    while (container.children.length > 2) container.firstElementChild.remove();
    setTimeout(() => { [...container.querySelectorAll('.leaving')].forEach(old => old.remove()); },700);
    if (animate) { animateElement($('#stage-copy'),'copy-enter'); animateElement($('#floating-feature'),'feature-enter'); }
  }
  function tick(timestamp) {
    if (!playing || document.hidden) { animationFrame = 0; lastFrame = 0; return; }
    if (lastFrame) elapsed += Math.min(timestamp - lastFrame,250);
    lastFrame = timestamp;
    if (elapsed >= duration) renderScene(current + 1);
    sceneButtons[current].style.setProperty('--progress',String(Math.min(elapsed / duration,1)));
    animationFrame = requestAnimationFrame(tick);
  }
  function syncPlayback() {
    const label = playing ? 'Pausar apresentação' : 'Reproduzir apresentação';
    $('#play-pause').innerHTML = icon(playing ? 'pause' : 'play');
    $('#play-pause').setAttribute('aria-label',label);
    $('#play-pause').title = label;
    $('#play-pause').setAttribute('aria-pressed',String(playing));
    $('#playback-state').textContent = playing ? 'EM MOVIMENTO' : 'NO SEU RITMO';
    $('#scene-announcement').setAttribute('aria-live',playing ? 'off' : 'polite');
    stage.classList.toggle('paused',!playing);
    cancelAnimationFrame(animationFrame);
    animationFrame = 0; lastFrame = 0;
    if (playing && !document.hidden) animationFrame = requestAnimationFrame(tick);
  }
  function selectScene(index) {
    playing = false;
    syncPlayback();
    renderScene(index);
    revealControls();
  }
  function message(text) {
    clearTimeout(messageTimer);
    $('#showcase-message').textContent = text;
    $('#showcase-message').classList.add('visible');
    messageTimer = setTimeout(() => $('#showcase-message').classList.remove('visible'),4500);
  }

  // Presentation controls are concealed only in exhibition mode; any interaction restores them.
  function setHidden(hidden) {
    stage.classList.toggle('ui-hidden',hidden);
    document.querySelectorAll('.exhibition-ui').forEach(element => { element.inert = hidden; });
    $('#exit-exhibition').inert = hidden;
  }
  function scheduleHide() {
    clearTimeout(hideTimer);
    if (!exhibition) return;
    hideTimer = setTimeout(() => {
      if (document.activeElement?.closest('.exhibition-ui,.exit-exhibition')) return;
      setHidden(true);
    },4000);
  }
  function revealControls() { if (stage.classList.contains('ui-hidden')) setHidden(false); scheduleHide(); }
  async function requestWakeLock() {
    if (!exhibition || document.hidden || !navigator.wakeLock || wakeLock) return;
    try { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release',() => { wakeLock = null; }); }
    catch { /* Exhibition works even when the browser cannot prevent screen sleep. */ }
  }
  async function leaveExhibition() {
    exhibition = false;
    clearTimeout(hideTimer); setHidden(false);
    stage.classList.remove('exhibition');
    $('#exhibition-button').setAttribute('aria-pressed','false');
    const shouldExit = ownsFullscreen && document.fullscreenElement === stage;
    ownsFullscreen = false;
    if (wakeLock) { try { await wakeLock.release(); } catch {} wakeLock = null; }
    if (shouldExit) { try { await document.exitFullscreen(); } catch {} }
    $('#exhibition-button').focus({preventScroll:true});
  }
  async function enterExhibition() {
    if (exhibition) return leaveExhibition();
    exhibition = true;
    stage.classList.add('exhibition');
    stage.setAttribute('tabindex','-1');
    stage.focus({preventScroll:true});
    $('#exhibition-button').setAttribute('aria-pressed','true');
    playing = true; syncPlayback();
    if (stage.requestFullscreen) {
      try { await stage.requestFullscreen(); ownsFullscreen = true; }
      catch { message('Modo exposição ativado. Use F11 se quiser ocultar a barra do navegador.'); }
    } else message('Modo exposição ativado. Use a opção de tela cheia do navegador, se disponível.');
    await requestWakeLock();
    scheduleHide();
  }

  sceneButtons.forEach((button,index) => button.addEventListener('click',() => selectScene(index)));
  $('#previous-scene').addEventListener('click',() => selectScene(current - 1));
  $('#next-scene').addEventListener('click',() => selectScene(current + 1));
  $('#play-pause').addEventListener('click',() => { playing = !playing; syncPlayback(); revealControls(); });
  $('#exhibition-button').addEventListener('click',enterExhibition);
  $('#exit-exhibition').addEventListener('click',leaveExhibition);
  stage.addEventListener('pointermove',revealControls,{passive:true});
  stage.addEventListener('pointerdown',revealControls,{passive:true});
  stage.addEventListener('focusin',revealControls);
  document.addEventListener('keydown',event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    revealControls();
    if (event.key === 'Escape' && exhibition) { event.preventDefault(); leaveExhibition(); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); selectScene(current + 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); selectScene(current - 1); }
    else if (event.code === 'Space' && !event.target.closest('button,a')) { event.preventDefault(); playing = !playing; syncPlayback(); }
  });
  document.addEventListener('fullscreenchange',() => {
    if (ownsFullscreen && !document.fullscreenElement) leaveExhibition();
    fitDisplay();
  });
  document.addEventListener('visibilitychange',() => {
    syncPlayback();
    if (!document.hidden && exhibition) { revealControls(); requestWakeLock(); }
  });
  reducedMotion.addEventListener('change',() => { if (reducedMotion.matches) { playing = false; syncPlayback(); } });

  // Preserve links shared before the exhibition became the home page.
  if (['#demonstracao','#recursos','#como-funciona','#projeto'].includes(location.hash)) {
    location.replace(new URL(`./explorar.html${location.hash}`,location.href));
    return;
  }
  renderScene(0,false);
  syncPlayback();
})();
