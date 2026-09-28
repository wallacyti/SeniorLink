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
  const sceneButtons = [...document.querySelectorAll('.scene-button')];
  const miniBrand = `<div class="screen-mini-brand"><img src="./assets/mark.svg" alt="">SeniorLink</div>`;
  const waves = `<svg class="screen-waves" viewBox="0 0 406 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 28Q80 95 185 60T406 2V140H0Z" fill="#cbece6"/><path d="M0 72Q90 22 200 84T406 43V140H0Z" fill="#86d0cd"/><path d="M0 100Q100 54 211 104T406 83V140H0Z" fill="#39aca8"/></svg>`;
  const originalLogo = `<svg class="original-logo" viewBox="50 154 125 117" aria-hidden="true"><image href="./assets/mvp-banner.jpeg" width="1434" height="1097"/></svg>`;
  const screens = {
    connection: () => `<div class="splash-orbits"></div>${originalLogo}<strong class="splash-name">SeniorLink</strong><span class="splash-tagline">MAIS CONEXÃO PARA<br>TODAS AS FASES DA VIDA</span><span class="splash-rule">${icon('heart')}</span><div class="splash-bottom"><span>Cuidado hoje,<br>mais liberdade amanhã.</span></div>${waves}`,
    location: () => `${miniBrand}<h2>Perto de quem<br>importa.</h2><p class="subline">Uma conexão que acompanha você.</p><span class="screen-chip">Localização ilustrativa</span><div class="visual-map"><svg viewBox="0 0 406 437" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="406" height="437" fill="#e6eee3"/><path d="M-30 98 450 0M-20 249 430 132M-20 434 440 299M22-30 214 480M255-30 420 440" stroke="#d4e0cf" stroke-width="23"/><path d="M-30 98 450 0M-20 249 430 132M-20 434 440 299M22-30 214 480M255-30 420 440" stroke="white" stroke-width="18"/><path d="M-20 335 440 224M123-20 310 480" stroke="#fafcf8" stroke-width="10"/><path d="M440 19Q290 160 444 244T422 454" fill="none" stroke="#badfe2" stroke-width="45"/><rect x="34" y="247" width="76" height="69" rx="15" fill="#c0d9b5" transform="rotate(-14 65 280)"/><rect x="150" y="78" width="78" height="53" rx="11" fill="#c8dcbd" transform="rotate(-14 180 100)"/><path class="map-route loop-animation" d="M112 388 149 377 121 307 191 287 178 249 219 239"/><circle cx="112" cy="388" r="6" fill="#6eaf94"/></svg><div class="map-person"><img src="./assets/avatar.svg" alt=""></div><span class="map-location-label">Maria está aqui <span>·</span></span></div><div class="map-address">${icon('pin')}<div><strong>Av. das Flores, 123</strong><small>Belém · PA · Endereço fictício</small></div></div><div class="visual-action">${icon('pin')} Compartilhar localização</div><p class="screen-note">Uma prévia do cuidado em família.</p>`,
    reminders: () => `${miniBrand}<h2>No seu tempo.<br>Na hora certa.</h2><p class="subline">Os pequenos cuidados também importam.</p><div class="time-display">08:00</div><div class="time-caption">${icon('sun')} UM NOVO DIA COMEÇA</div><div class="reminder-visual"><span class="r-icon">${icon('bell')}</span><span><strong>Seu cuidado da manhã</strong><small>Lembrete de exemplo · 08:00</small></span><span class="r-check"></span></div><div class="reminder-visual completed"><span class="r-icon">${icon('check')}</span><span><strong>Beber água</strong><small>Um cuidado concluído</small></span><span class="r-check">${icon('check')}</span></div><div class="reminder-visual"><span class="r-icon">${icon('clock')}</span><span><strong>Hora da caminhada</strong><small>Um tempo para você · 09:00</small></span><span class="r-check"></span></div><div class="reminder-caption">${icon('heart')} Um lembrete de carinho, todos os dias.</div>`,
    support: () => `${miniBrand}<h2>Você pode<br>contar com alguém.</h2><div class="support-disc">${icon('phone')}<strong>SOS</strong></div><h3>Ajuda a um toque.</h3><p class="support-caption">Seu contato de confiança,<br>perto quando você precisar.</p><div class="contact-visual"><span class="contact-avatar">C</span><span><strong>Carlos</strong><small>Filho · Contato de exemplo</small></span>${icon('phone')}</div><p class="screen-note">Demonstração · Nenhuma ligação real</p>`,
    learning: () => `${miniBrand}<h2>Aprender.<br>Um passo de cada vez.</h2><p class="subline">Mais confiança para usar a tecnologia.</p><div class="learning-illustration">${icon('book')}<span class="learning-spark">✦</span><span class="learning-small-spark">✧</span></div><div class="lesson-visual">${icon('text')}<span><strong>Aumentar as letras</strong><small>Mais conforto para ler</small></span><span>›</span></div><div class="lesson-visual">${icon('phone')}<span><strong>Fazer uma ligação</strong><small>Fale com quem você gosta</small></span><span>›</span></div><div class="lesson-visual">${icon('users')}<span><strong>Enviar uma mensagem</strong><small>A conversa continua</small></span><span>›</span></div><p class="screen-note">Pequenas descobertas. Novas possibilidades.</p>`,
    autonomy: () => `${miniBrand}<div class="home-visual-greeting"><div><small>QUE BOM TER VOCÊ AQUI</small><h2>Olá, Maria!</h2><p>Vamos cuidar do seu dia?</p></div><img src="./assets/avatar.svg" alt=""></div><div class="home-visual-banner"><span>${icon('heart')} Um dia de cada vez.</span><strong>Mais cuidado.<br>Mais você.</strong></div><div class="home-visual-grid"><div class="visual-tile blue">${icon('user')}<strong>Meu perfil</strong><small>Sobre você</small></div><div class="visual-tile">${icon('pin')}<strong>Localização</strong><small>Sempre por perto</small></div><div class="visual-tile peach">${icon('bell')}<strong>Lembretes</strong><small>No seu tempo</small></div><div class="visual-tile lilac">${icon('book')}<strong>Aprender</strong><small>Um passo por vez</small></div></div><div class="home-visual-help">${icon('phone')}<span>Preciso de ajuda</span><span>›</span></div><div class="home-visual-nav">${icon('home')}${icon('pin')}${icon('bell')}${icon('user')}</div>`
  };
  const scenes = [
    {name:'Conexão',eyebrow:'MAIS CONEXÃO. MAIS VIDA.',heading:'Cuidado hoje.<br><em>Liberdade amanhã.</em>',description:'Mais conexão para todas as fases da vida.',signature:'SIMPLES PARA USAR. FEITO PARA CUIDAR.',floatingKicker:'NOSSA ESSÊNCIA',floatingTitle:'Uma conexão que cuida.',icon:'heart',screen:'connection',className:'splash-screen'},
    {name:'Localização',eyebrow:'A DISTÂNCIA FICA MENOR.',heading:'Por perto.<br><em>Mesmo de longe.</em>',description:'Quem você ama, a uma conexão de distância.',signature:'LOCALIZAÇÃO E UMA REDE DE CONFIANÇA.',floatingKicker:'PRESENÇA QUE TRANQUILIZA',floatingTitle:'Perto de quem importa.',icon:'pin',screen:'location',className:'screen-page location-screen'},
    {name:'Lembretes',eyebrow:'CUIDADO QUE FAZ PARTE DO DIA.',heading:'Pequenos cuidados.<br><em>Grandes diferenças.</em>',description:'Um lembrete. Um carinho. Um dia mais leve.',signature:'CADA MOMENTO MERECE ATENÇÃO.',floatingKicker:'NO SEU TEMPO',floatingTitle:'Hora de cuidar de você.',icon:'bell',screen:'reminders',className:'screen-page reminder-screen'},
    {name:'Apoio',eyebrow:'NINGUÉM PRECISA ESTAR SOZINHO.',heading:'Um toque.<br><em>Alguém por perto.</em>',description:'Sua rede de apoio, quando mais precisar.',signature:'CONFIANÇA É SABER COM QUEM CONTAR.',floatingKicker:'SUA REDE DE APOIO',floatingTitle:'Cuidado que acolhe.',icon:'phone',screen:'support',className:'screen-page support-screen'},
    {name:'Aprender',eyebrow:'NOVAS DESCOBERTAS, TODOS OS DIAS.',heading:'Aprender conecta.<br><em>Conhecer liberta.</em>',description:'A tecnologia também pode ser simples.',signature:'UM PASSO DE CADA VEZ. NO SEU RITMO.',floatingKicker:'AUTONOMIA DIGITAL',floatingTitle:'Você pode ir além.',icon:'book',screen:'learning',className:'screen-page learning-screen'},
    {name:'Autonomia',eyebrow:'A VIDA ACONTECE LÁ FORA.',heading:'Mais autonomia.<br><em>Mais vida.</em>',description:'Liberdade para viver. Conexão para cuidar.',signature:'SENIORLINK. TECNOLOGIA QUE APROXIMA.',floatingKicker:'PARA TODAS AS FASES DA VIDA',floatingTitle:'O cuidado acompanha você.',icon:'users',screen:'autonomy',className:'screen-page home-screen'}
  ];

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
    $('#scene-eyebrow').textContent = scene.eyebrow;
    $('#scene-heading').innerHTML = scene.heading;
    $('#scene-description').textContent = scene.description;
    $('#scene-signature').textContent = scene.signature;
    $('#floating-icon').innerHTML = icon(scene.icon);
    $('#floating-kicker').textContent = scene.floatingKicker;
    $('#floating-title').textContent = scene.floatingTitle;
    $('#rail-label').textContent = scene.name.toUpperCase();
    $('#rail-number').textContent = `${String(current + 1).padStart(2,'0')} / 06`;
    $('#handheld').setAttribute('aria-label',`Celular na mão mostrando ${scene.name.toLowerCase()} no SeniorLink. Prévia visual com dados fictícios.`);
    $('#scene-announcement').textContent = `Cena ${current + 1} de 6: ${scene.name}. ${scene.description}`;
    sceneButtons.forEach((button,i) => {
      button.classList.toggle('active',i === current);
      if (i === current) button.setAttribute('aria-current','true'); else button.removeAttribute('aria-current');
      button.style.setProperty('--progress','0');
    });
    const container = $('#screen-content');
    [...container.children].forEach(layer => { layer.classList.remove('shown'); layer.classList.add('leaving'); });
    const layer = document.createElement('div');
    layer.className = `screen-layer ${scene.className}`;
    layer.innerHTML = screens[scene.screen]();
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
