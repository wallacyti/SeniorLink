/* SeniorLink demonstration. No network requests, GPS access or real calls. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#${name}"/></svg>`;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storageKey = 'seniorlink-demo-v1';
  const initialReminders = () => [
    { id:'sample-1', title:'Lembrete de medicamento', time:'08:00', type:'medicamento', done:false },
    { id:'sample-2', title:'Hora da caminhada', time:'09:00', type:'compromisso', done:false },
    { id:'sample-3', title:'Consulta de rotina', time:'14:30', type:'compromisso', done:false }
  ];
  let reminders = initialReminders();
  let storageAvailable = true;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(stored) && stored.length <= 50) {
      const ids = new Set();
      const valid = stored.filter(r => r && typeof r.id === 'string' && r.id.length < 100 && typeof r.title === 'string' && r.title.trim().length > 0 && r.title.length <= 60 && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(r.time) && ['medicamento','compromisso'].includes(r.type) && typeof r.done === 'boolean' && !ids.has(r.id) && ids.add(r.id));
      if (valid.length === stored.length) reminders = valid;
    }
  } catch { storageAvailable = false; }
  let screen = 'home', role = 'senior', filter = 'all', tourTimer = null, toastTimer = null;
  let lessonIndex = 0, lessonStep = 0, largeText = false;
  const routeOrder = ['home','location','reminders','learn','sos','profile'];
  const app = $('#app-screen');
  const demo = $('#demonstracao');
  const labels = {home:'Início',location:'Localização',reminders:'Lembretes',learn:'Aprender',sos:'Preciso de ajuda',profile:'Meu perfil',contacts:'Contatos de confiança','add-reminder':'Novo lembrete',lesson:'Aprender', 'sos-confirm':'Simular pedido de ajuda', 'sos-result':'Simulação concluída',reset:'Reiniciar demonstração'};
  const tutorials = [
    { title:'Aumentar as letras', description:'Mais conforto para ler', icon:'text', color:'lilac', steps:[['Abra as configurações','No celular, procure o aplicativo Configurações ou Ajustes, normalmente representado por uma engrenagem.'],['Encontre as opções de texto','Procure por Tela, Acessibilidade ou Tamanho do texto. O nome pode variar conforme o celular.'],['Escolha um tamanho confortável','Aumente a letra e veja a prévia. Você pode voltar e ajustar novamente. Aqui na demonstração, use “Aumentar letras”, abaixo do celular.']] },
    { title:'Fazer uma ligação', description:'Fale com quem você gosta', icon:'phone', color:'mint', steps:[['Encontre o telefone','Na tela do celular, procure o ícone de telefone. Toque nele para abrir.'],['Escolha uma pessoa','Abra Contatos e procure a pessoa com quem quer falar. Confira o nome antes de continuar.'],['Comece a conversa','Toque no símbolo de telefone ao lado do contato. Para encerrar, toque no botão vermelho. Neste site, as ligações são apenas simuladas.']] },
    { title:'Enviar uma mensagem', description:'A conversa continua', icon:'users', color:'blue', steps:[['Abra seu aplicativo de mensagens','Procure o aplicativo que você costuma usar para conversar, como o WhatsApp.'],['Escolha o contato','Toque no nome da pessoa com quem deseja falar. Confira a foto e o nome para evitar enganos.'],['Escreva e envie','Toque no espaço da mensagem, escreva seu texto e toque na seta de enviar. Você também pode usar o botão de microfone do aplicativo.']] },
    { title:'Conhecer o SeniorLink', description:'Descubra os principais recursos', icon:'heart', color:'peach', steps:[['Comece pela tela inicial','A tela inicial reúne os atalhos para perfil, localização, lembretes e aprendizado.'],['Explore no seu ritmo','Toque em um recurso e use a seta de voltar para retornar. O menu na parte de baixo também ajuda a navegar.'],['Conte com sua rede','A área “Preciso de ajuda” reúne contatos de confiança. Aqui você pode experimentar o fluxo sem enviar mensagens nem fazer ligações reais.']] }
  ];
  function notify(message) {
    clearTimeout(toastTimer);
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 5200);
  }
  function saveReminders() {
    try { localStorage.setItem(storageKey, JSON.stringify(reminders)); storageAvailable = true; }
    catch { storageAvailable = false; }
  }
  function title(text, back = 'home') { return `<div class="app-title-row"><button class="app-back" data-screen="${back}" aria-label="Voltar para ${escapeHTML(labels[back] || 'início')}">${icon('back')}</button><h3 tabindex="-1">${text}</h3></div>`; }
  function tile(name, text, sub, color, symbol) { return `<button class="app-tile ${color}" data-screen="${name}">${icon(symbol)}<strong>${text}</strong><small>${sub}</small></button>`; }
  function home() {
    return `<div class="app-greeting"><div><small>QUE BOM TER VOCÊ AQUI</small><h3 tabindex="-1">Olá, ${role === 'senior' ? 'Maria' : 'Carlos'}! <span class="greeting-sun">☀</span></h3><p>${role === 'senior' ? 'Que bom te ver por aqui!' : 'Uma conexão que cuida.'}</p></div><img src="./assets/avatar.svg" width="50" height="50" alt="Avatar de Maria, personagem de demonstração"></div>
      ${role === 'senior' ? '' : '<div class="family-summary"><img src="./assets/avatar.svg" alt=""><div><strong>Maria, sua mãe</strong><small>Conexão de exemplo</small><small>Explore o cuidado em família.</small></div></div>'}
      <div class="app-tile-grid">${tile('profile',role === 'senior' ? 'Meu perfil' : 'Perfil de Maria','Seus dados importantes','blue','user')}${tile('location','Localização','Ver sua localização','mint','pin')}${tile('reminders','Lembretes','Não esqueça do importante','peach','bell')}${tile('learn','Aprender','Tutoriais e dicas','blue','book')}</div>
      <button class="preview-sos" data-screen="sos"><span class="sos-small">${icon('phone')}</span><div><strong>${role === 'senior' ? 'Emergência' : 'Rede de apoio'}</strong><small>Contatos de confiança</small></div><span aria-hidden="true">›</span></button>`;
  }
  function locationView() {
    return `${title('Localização')}<p class="app-subtitle">${role === 'senior' ? 'Perto de quem se importa.' : 'Acompanhe o exemplo de Maria.'}</p><span class="app-tag">Mapa ilustrativo · Sem acesso ao GPS</span>
      <div class="app-map" role="img" aria-label="Mapa fictício com Maria no centro, próximo a uma praça."><svg class="map-svg" viewBox="0 0 300 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="300" height="230" fill="#e8eee2"/><path d="M-20 100 330 5M-20 230 310 135M65-20 165 250M185-20 280 250" stroke="#d7e0cf" stroke-width="21"/><path d="M-20 100 330 5M-20 230 310 135M65-20 165 250M185-20 280 250" stroke="#fff" stroke-width="17"/><path d="m0 130 330-92m-300-58 93 250" stroke="#fff" stroke-width="8"/><rect x="33" y="114" width="48" height="50" rx="12" fill="#bed9b4" transform="rotate(-16 60 140)"/><rect x="161" y="135" width="51" height="38" rx="8" fill="#c6dabe" transform="rotate(-16 180 155)"/><path d="M278-10Q216 73 300 124T286 250" stroke="#bedee0" stroke-width="27" fill="none"/><text x="30" y="144" fill="#719365" font-size="8">Praça</text><text x="184" y="198" fill="#96a48d" font-size="8">Jardim</text></svg><span class="map-top-label"><span class="status-dot"></span>Maria · Posição de exemplo</span><span class="map-center"><img src="./assets/avatar.svg" alt=""></span><span class="map-legend">Cenário fictício</span></div>
      <div class="app-address">${icon('pin')}<div><small>Endereço de exemplo</small>Av. das Flores, 123<br>Belém · PA</div></div><button class="app-primary" data-action="share-location">${icon('pin')} Simular compartilhamento</button><p class="app-note">Nesta demonstração, a posição é fixa e nenhuma localização é compartilhada.</p>`;
  }
  function remindersView() {
    const list = reminders.filter(r => filter === 'all' || r.type === filter).sort((a,b) => a.time.localeCompare(b.time));
    return `${title('Meus lembretes')}<p class="app-subtitle">Pequenos cuidados, no seu tempo.</p><div class="app-filters" aria-label="Filtrar lembretes">${[['all','Todos'],['medicamento','Medicamentos'],['compromisso','Compromissos']].map(([id,label]) => `<button class="app-filter ${filter === id ? 'active' : ''}" data-filter="${id}" aria-pressed="${filter === id}">${label}</button>`).join('')}</div>
      <div class="reminder-list">${list.length ? list.map(r => `<div class="reminder-item ${r.done ? 'done' : ''}"><span class="reminder-symbol ${r.type === 'medicamento' ? 'peach' : 'mint'}">${icon(r.type === 'medicamento' ? 'bell' : 'clock')}</span><div><strong>${escapeHTML(r.title)}</strong><span class="reminder-time">${escapeHTML(r.time)}</span><small>${r.done ? 'Concluído nesta demonstração' : 'Lembrete de exemplo'}</small></div><button class="reminder-check" data-reminder-id="${escapeHTML(r.id)}" aria-label="${r.done ? 'Marcar como pendente' : 'Concluir'}: ${escapeHTML(r.title)}" aria-pressed="${r.done}"><span>${r.done ? icon('check') : ''}</span></button></div>`).join('') : '<p class="empty-state">Nenhum lembrete nesta categoria.</p>'}</div><button class="app-primary" data-screen="add-reminder">${icon('plus')} Adicionar lembrete</button><p class="app-note">Exemplos salvos somente neste navegador. Não há envio de notificações.</p>`;
  }
  function addReminderView() {
    return `${title('Novo lembrete','reminders')}<p class="app-subtitle">Vamos organizar um cuidado?</p><form class="app-form" id="reminder-form"><label for="reminder-title">O que você quer lembrar?<input id="reminder-title" name="title" maxlength="60" placeholder="Ex.: Caminhar no parque" required autocomplete="off"></label><label for="reminder-time">Horário<input id="reminder-time" name="time" type="time" value="09:00" required></label><label for="reminder-type">Categoria<select name="type" id="reminder-type"><option value="compromisso">Compromisso</option><option value="medicamento">Medicamento</option></select></label><p class="app-note">Use apenas exemplos. Este lembrete faz parte da demonstração.</p><p id="form-error" class="form-error" role="alert"></p><button type="submit" class="app-primary">${icon('check')} Salvar lembrete</button><button type="button" data-screen="reminders" class="app-secondary">Cancelar</button></form>`;
  }
  function learnView() {
    return `${title('Vamos aprender?')}<p class="app-subtitle">No seu ritmo, um passo de cada vez.</p><div class="lesson-list">${tutorials.map((l,i) => `<button class="lesson-button" data-lesson="${i}"><span class="feature-icon ${l.color}">${icon(l.icon)}</span><span><strong>${l.title}</strong><small>${l.description} · 3 passos</small></span><span aria-hidden="true">›</span></button>`).join('')}</div><p class="app-note">Os nomes dos menus podem variar conforme o modelo do celular.</p>`;
  }
  function lessonView() {
    const l = tutorials[lessonIndex], step = l.steps[lessonStep];
    return `${title(l.title,'learn')}<div class="lesson-progress">PASSO ${lessonStep + 1} DE ${l.steps.length}</div><div class="lesson-art">${icon(l.icon)}</div><h4 class="lesson-title">${step[0]}</h4><p class="lesson-copy">${step[1]}</p><div class="lesson-actions"><button class="app-secondary" data-action="lesson-back" ${lessonStep === 0 ? 'disabled' : ''}>Anterior</button><button class="app-primary" data-action="lesson-next">${lessonStep === l.steps.length - 1 ? 'Concluir' : 'Próximo '+icon('arrow')}</button></div>`;
  }
  function sosView() {
    return `${title(role === 'senior' ? 'Emergência' : 'Rede de apoio')}<p class="app-subtitle">Você pode contar com alguém.</p><span class="sos-tag">DEMONSTRAÇÃO · NENHUMA LIGAÇÃO REAL</span><button class="sos-disc" data-screen="sos-confirm" aria-label="Simular pedido de ajuda SOS">${icon('phone')}<span>SOS</span></button><div class="sos-heading"><strong>Seu contato está por perto.</strong><p>Toque para conhecer o fluxo de ajuda.</p></div><button class="app-secondary" data-screen="contacts">${icon('users')} Contatos de confiança</button><button class="app-secondary danger" data-action="share-location">${icon('pin')} Simular envio de localização</button>`;
  }
  function sosConfirmView() {
    return `${title('Pedir ajuda','sos')}<div class="sos-result">${icon('phone')}<h4>Vamos avisar o Carlos?</h4><p>Em um aplicativo conectado, seu contato de confiança receberia o pedido de ajuda.</p></div><div class="app-contact"><span class="contact-initial">C</span><div><strong>Carlos</strong><small>Filho · Contato de exemplo</small></div></div><p class="app-note">Aqui, nenhuma mensagem, ligação ou solicitação de emergência será enviada.</p><button class="app-primary danger" data-screen="sos-result">Simular pedido de ajuda</button><button class="app-secondary" data-screen="sos">Voltar</button>`;
  }
  function sosResultView() {
    return `${title('Simulação concluída','sos')}<div class="sos-result">${icon('check')}<h4>Assim começa o cuidado.</h4><p>Você percorreu o fluxo de pedido de ajuda do SeniorLink.</p></div><p class="app-note">Nenhum contato foi acionado. Em uma versão conectada, o familiar poderia receber um alerta e acessar a localização compartilhada.</p><button class="app-primary" data-screen="home">Voltar ao início</button><button class="app-secondary" data-screen="contacts">Ver contatos de confiança</button>`;
  }
  function contactsView() {
    return `${title('Meus contatos','sos')}<p class="app-subtitle">Pessoas que fazem parte do cuidado.</p>${[['Carlos','Filho','C'],['Ana','Neta','A'],['João','Cuidador','J']].map(([name,relation,initial]) => `<div class="app-contact"><span class="contact-initial">${initial}</span><div><strong>${name}</strong><small>${relation} · Exemplo</small></div><button data-call="${name}" aria-label="Simular ligação para ${name}">${icon('phone')}</button></div>`).join('')}<p class="app-note">Contatos fictícios para explorar a proposta. Os botões não fazem ligações reais.</p>`;
  }
  function profileView() {
    return `${title(role === 'senior' ? 'Meu perfil' : 'Perfil de Maria')}<img class="profile-avatar" src="./assets/avatar.svg" alt="Ilustração de Maria"><div class="profile-name">Maria Silva de Oliveira</div><div class="profile-label">PERSONAGEM FICTÍCIA · PERFIL DE EXEMPLO</div><dl class="profile-fields"><div><dt>Nascimento</dt><dd>12/03/1950</dd></div><div><dt>Tipo sanguíneo</dt><dd>O+</dd></div><div class="wide"><dt>Alergias</dt><dd>Informação ilustrativa</dd></div><div class="wide"><dt>Medicamentos e condições importantes</dt><dd>Ficha demonstrativa</dd></div><div class="wide"><dt>Contato de confiança</dt><dd>Carlos · Filho</dd></div></dl><button class="app-primary" data-screen="contacts">${icon('users')} Ver contatos de confiança</button><p class="app-note">Na proposta do app, esta área reúne informações importantes para o cuidado.</p>`;
  }
  function resetView() {
    return `${title('Começar de novo?')}<div class="lesson-art">${icon('refresh')}</div><p>Isso apaga os lembretes criados neste navegador e restaura os três exemplos iniciais da demonstração.</p><button class="app-primary" data-action="confirm-reset">Sim, reiniciar demonstração</button><button class="app-secondary" data-screen="home">Continuar explorando</button>`;
  }
  const renderers = {home,location:locationView,reminders:remindersView,'add-reminder':addReminderView,learn:learnView,lesson:lessonView,sos:sosView,'sos-confirm':sosConfirmView,'sos-result':sosResultView,contacts:contactsView,profile:profileView,reset:resetView};
  function render(focus = false, resetScroll = true) {
    app.innerHTML = renderers[screen]();
    if (resetScroll) app.scrollTop = 0;
    const parentScreen = ({'add-reminder':'reminders',lesson:'learn','sos-confirm':'sos','sos-result':'sos',contacts:'sos'})[screen] || screen;
    $$('.screen-selector').forEach(b => { b.classList.toggle('active', b.dataset.screen === parentScreen); b.setAttribute('aria-pressed',String(b.dataset.screen === parentScreen)); });
    $$('.app-bottom button').forEach(b => { if (b.dataset.screen === parentScreen) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
    if (focus) $('h3', app)?.focus({preventScroll:true});
  }
  function navigate(next, focus = true, automatic = false) {
    if (!renderers[next]) return;
    if (!automatic) stopTour();
    screen = next; render(focus);
  }
  function updateTourButton() {
    const active = tourTimer !== null, button = $('#tour-button');
    button.setAttribute('aria-pressed', String(active));
    button.innerHTML = `${icon(active ? 'pause' : 'play')}<span>${active ? 'Pausar apresentação' : 'Apresentação automática'}</span>`;
  }
  function stopTour() { if (tourTimer !== null) { clearInterval(tourTimer); tourTimer = null; updateTourButton(); } }
  document.addEventListener('click', event => {
    const button = event.target.closest('button[data-screen]');
    if (button) navigate(button.dataset.screen);
    const open = event.target.closest('[data-open-screen]');
    if (open) navigate(open.dataset.openScreen, false);
  });
  app.addEventListener('click', event => {
    const filterButton = event.target.closest('[data-filter]');
    if (filterButton) { stopTour(); filter = filterButton.dataset.filter; render(false); $$('[data-filter]',app).find(b => b.dataset.filter === filter)?.focus({preventScroll:true}); }
    const reminderButton = event.target.closest('[data-reminder-id]');
    if (reminderButton) {
      stopTour(); const r = reminders.find(item => item.id === reminderButton.dataset.reminderId);
      if (!r) return;
      r.done = !r.done; saveReminders(); const scroll = app.scrollTop; render(false,false); app.scrollTop = scroll;
      $$('[data-reminder-id]',app).find(b => b.dataset.reminderId === r.id)?.focus({preventScroll:true});
      notify(r.done ? 'Lembrete concluído na demonstração.' : 'Lembrete marcado como pendente.');
    }
    const lesson = event.target.closest('[data-lesson]');
    if (lesson) { lessonIndex = Number(lesson.dataset.lesson); lessonStep = 0; navigate('lesson'); }
    const call = event.target.closest('[data-call]');
    if (call) { stopTour(); notify(`Simulação: ligação para ${call.dataset.call}. Nenhuma chamada foi realizada.`); }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    stopTour();
    if (action === 'share-location') notify('Simulação concluída. Nenhuma localização real foi acessada ou enviada.');
    if (action === 'lesson-next') {
      if (lessonStep < tutorials[lessonIndex].steps.length - 1) { lessonStep++; render(true); }
      else { navigate('learn'); notify('Muito bem! Você concluiu os três passos deste tutorial.'); }
    }
    if (action === 'lesson-back' && lessonStep > 0) { lessonStep--; render(true); }
    if (action === 'confirm-reset') {
      reminders = initialReminders(); saveReminders(); filter = 'all'; role = 'senior'; setRoleButtons();
      largeText = false; applyTextSize(); navigate('home'); notify('Demonstração reiniciada. Tudo pronto para a próxima pessoa!');
    }
  });
  app.addEventListener('submit', event => {
    if (event.target.id !== 'reminder-form') return;
    event.preventDefault(); stopTour();
    const data = new FormData(event.target), name = String(data.get('title')).trim(), time = String(data.get('time')), type = String(data.get('type'));
    if (!name || name.length > 60) { $('#form-error').textContent = 'Escreva um título de até 60 caracteres.'; $('#reminder-title').focus(); return; }
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time) || !['compromisso','medicamento'].includes(type)) { $('#form-error').textContent = 'Confira o horário e a categoria.'; return; }
    if (reminders.length >= 50) { $('#form-error').textContent = 'O limite da demonstração é de 50 lembretes. Reinicie para começar novamente.'; return; }
    reminders.push({id:globalThis.crypto?.randomUUID?.() || `r-${Date.now()}-${Math.random().toString(36).slice(2)}`, title:name, time, type, done:false});
    saveReminders(); filter = 'all'; navigate('reminders');
    notify(storageAvailable ? 'Lembrete salvo neste navegador. Experimente marcá-lo como concluído.' : 'Lembrete criado nesta sessão. O navegador não permitiu salvá-lo para depois.');
  });
  function setRoleButtons() { $$('[data-role]').forEach(b => { b.classList.toggle('active', b.dataset.role === role); b.setAttribute('aria-pressed',String(b.dataset.role === role)); }); }
  $$('[data-role]').forEach(b => b.addEventListener('click', () => { role = b.dataset.role; setRoleButtons(); navigate('home',false); notify(role === 'family' ? 'Visão do familiar: Carlos acompanha Maria neste exemplo.' : 'Visão da pessoa idosa: explore o dia a dia de Maria.'); }));
  $('#tour-button').addEventListener('click', () => {
    if (tourTimer !== null) { stopTour(); notify('Apresentação pausada. Explore no seu ritmo.'); return; }
    navigate('home',false);
    tourTimer = setInterval(() => { const i = routeOrder.indexOf(screen); navigate(routeOrder[(i + 1) % routeOrder.length],false,true); },8000);
    updateTourButton(); notify('Apresentação iniciada. As telas mudam a cada 8 segundos. Toque em qualquer recurso para pausar.');
  });
  $('#fullscreen-button').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (demo.requestFullscreen) await demo.requestFullscreen(); else notify('Use a opção de tela cheia do seu navegador para apresentar.'); }
    catch { notify('O navegador não permitiu tela cheia. Você pode usar o atalho F11 no computador.'); }
  });
  document.addEventListener('fullscreenchange', () => { const label = document.fullscreenElement ? 'Sair da tela cheia' : 'Abrir demonstração em tela cheia'; $('#fullscreen-button').setAttribute('aria-label',label); $('#fullscreen-button').title = label; });
  function applyTextSize() { $('#demo-phone').style.setProperty('--app-scale',largeText ? '1.18' : '1'); $('#large-text-button').setAttribute('aria-pressed',String(largeText)); $('#large-text-button').innerHTML = `${icon('text')} ${largeText ? 'Letras no tamanho padrão' : 'Aumentar letras'}`; }
  $('#large-text-button').addEventListener('click', () => { stopTour(); largeText = !largeText; applyTextSize(); notify(largeText ? 'Letras da demonstração ampliadas.' : 'Tamanho padrão restaurado.'); });
  $('#reset-button').addEventListener('click', () => navigate('reset'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopTour(); });
  const menuToggle = $('#menu-toggle'), menu = $('#site-nav');
  function closeMenu() { menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','Abrir menu'); }
  menuToggle.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuToggle.setAttribute('aria-expanded',String(open)); menuToggle.setAttribute('aria-label',open ? 'Fechar menu' : 'Abrir menu'); });
  menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); menuToggle.focus(); } });
  document.addEventListener('click', e => { if (!menu.contains(e.target) && !menuToggle.contains(e.target)) closeMenu(); });
  window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);
  const dialog = $('#materials-dialog');
  $('#materials-button').addEventListener('click', () => { stopTour(); dialog.showModal(); });
  $('#close-materials').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => $('video',dialog).pause());
  render();
})();
