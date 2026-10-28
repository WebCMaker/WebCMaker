(function () {
  'use strict';
  const copy = window.WEBIT_COPY;
  if (!copy) return;
  const supported = ['ru', 'en', 'uk'];
  const page = ['home', 'projects', 'services', 'brief'].includes(document.body.dataset.page) ? document.body.dataset.page : 'home';
  const contactEmail = 'webcmaker@gmail.com';
  const storageKey = 'webcmaker-language';
  let saved = '';
  try { saved = localStorage.getItem(storageKey) || ''; } catch (_) {}
  let lang = supported.includes(saved) ? saved : 'ru';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const star = '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5v38M7.5 14.5l33 19M7.5 33.5l33-19" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>';
  const mark = '<img src="brand-mark.svg?v=23" width="40" height="40" alt="" decoding="async">';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stopMotion = () => {};
  const words = {
    ru: { skip:'К содержимому', menu:'Открыть меню', nav:'Навигация', independent:'Дизайн. Код. Ваш характер.', work:'Выбранные проекты', view:'Открыть сайт', concept:'Учебный концепт', coffee:'Кофейня', construction:'Строительная компания', approach:'Мой подход', process:'Как работаем', question:'Есть идея?', write:'Давайте обсудим.', more:'Ещё немного деталей', copy:'Скопировать бриф', copied:'Бриф скопирован. Вставьте его в письмо.', copyError:'Не удалось скопировать. Выделите ответы и отправьте их на почту.', deliver:'От дизайна до запуска.', result:'Дизайн и разработка', scope:'Домен, хостинг и публикация', homeTitle:'WebCMaker — дизайн и разработка сайтов', projectsTitle:'Работы — WebCMaker', servicesTitle:'Услуги — WebCMaker', briefTitle:'Обсудить проект — WebCMaker', faqNote:'Остались вопросы? Напишите мне.', from:'От идеи до готового сайта', allWork:'Все работы', sent:'Спасибо! Бриф передан. Я отвечу по указанному контакту.', privacy:'Политика сервиса', submitFallback:'Можно также скопировать бриф и отправить его на' },
    en: { skip:'Skip to content', menu:'Open menu', nav:'Navigation', independent:'Design. Code. Your character.', work:'Selected projects', view:'Explore website', concept:'Demo concept', coffee:'Coffee shop', construction:'Construction company', approach:'My approach', process:'How it works', question:'Have an idea?', write:'Let’s talk.', more:'A few more details', copy:'Copy brief', copied:'Brief copied. Paste it into an email.', copyError:'Could not copy. Select your answers and send them by email.', deliver:'From design to launch.', result:'Design & development', scope:'Domain, hosting and publishing', homeTitle:'WebCMaker — website design & development', projectsTitle:'Work — WebCMaker', servicesTitle:'Services — WebCMaker', briefTitle:'Start a project — WebCMaker', faqNote:'Have another question? Email me.', from:'From an idea to a finished website', allWork:'All work', sent:'Thank you! Your brief has been submitted. I’ll reply using your contact details.', privacy:'Service privacy policy', submitFallback:'You can also copy your brief and email it to' },
    uk: { skip:'До вмісту', menu:'Відкрити меню', nav:'Навігація', independent:'Дизайн. Код. Ваш характер.', work:'Вибрані проєкти', view:'Відкрити сайт', concept:'Навчальний концепт', coffee:'Кав’ярня', construction:'Будівельна компанія', approach:'Мій підхід', process:'Як працюємо', question:'Є ідея?', write:'Обговорімо.', more:'Ще трохи деталей', copy:'Скопіювати бриф', copied:'Бриф скопійовано. Вставте його в лист.', copyError:'Не вдалося скопіювати. Виділіть відповіді й надішліть їх на пошту.', deliver:'Від дизайну до запуску.', result:'Дизайн і розробка', scope:'Домен, хостинг і публікація', homeTitle:'WebCMaker — дизайн і розробка сайтів', projectsTitle:'Роботи — WebCMaker', servicesTitle:'Послуги — WebCMaker', briefTitle:'Обговорити проєкт — WebCMaker', faqNote:'Залишилися запитання? Напишіть мені.', from:'Від ідеї до готового сайту', allWork:'Усі роботи', sent:'Дякую! Бриф передано. Я відповім за вказаним контактом.', privacy:'Політика сервісу', submitFallback:'Можна також скопіювати бриф і надіслати його на' }
  };
  const ui = () => words[lang];
  const link = (href, label, className = '') => `<a class="${className}" href="${href}">${label}</a>`;
  const logo = () => `<span class="brand-mark">${mark}</span><span class="brand-name">WebCMaker<span class="brand-period">.</span></span>`;
  const heading = title => {
    const index = title.indexOf('. ');
    return index > 0 ? `${esc(title.slice(0, index + 1))} <span>${esc(title.slice(index + 2))}</span>` : esc(title);
  };
  function header(t) {
    const items = [['home','index.html'],['projects','projects.html'],['services','services.html']];
    return `<a class="skip-link" href="#main">${ui().skip}</a><header class="site-header"><div class="container header-inner">
      <a class="brand" href="index.html" aria-label="WebCMaker — ${esc(t.nav.home)}">${logo()}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="${ui().menu}"><span></span><span></span></button>
      <nav class="main-nav" id="main-nav" aria-label="${ui().nav}"><div class="nav-pages">${items.map(([key, href]) => `<a class="nav-link${page === key ? ' active' : ''}" href="${href}"${page === key ? ' aria-current="page"' : ''}>${esc(t.nav[key])}</a>`).join('')}</div>
      <div class="nav-actions"><div class="language-switch" aria-label="Language">${supported.map(code => `<button class="language-button${lang === code ? ' active' : ''}" type="button" data-language="${code}" aria-pressed="${lang === code}" aria-label="${esc(copy[code].langName)}">${code === 'uk' ? 'UA' : code.toUpperCase()}</button>`).join('')}</div>${link('brief.html', `${esc(t.nav.brief)} ${arrow}`, 'button button-small button-dark nav-cta')}</div></nav>
    </div></header>`;
  }
  function footer(t) {
    return `<footer class="site-footer"><div class="container footer-top"><div class="footer-intro"><span class="eyebrow">${ui().question}</span><h2>${ui().write}</h2><a class="footer-email" href="mailto:${contactEmail}">${contactEmail}${arrow}</a></div><div class="footer-note"><a class="brand" href="index.html" aria-label="WebCMaker">${logo()}</a><p>${esc(t.footerLine)}</p>${link('brief.html', `${esc(t.nav.brief)} ${arrow}`, 'text-link')}</div></div><div class="container footer-bottom"><span>© <span class="current-year">2026</span> WebCMaker</span><div>${link('projects.html', esc(t.nav.projects))}${link('services.html', esc(t.nav.services))}</div><a class="back-top" href="#main" aria-label="${lang === 'en' ? 'Back to top' : lang === 'uk' ? 'Нагору' : 'Наверх'}">↑</a></div></footer>`;
  }
  function projectCard(kind, number) {
    const coffee = kind === 'coffee';
    const title = coffee ? 'TERRA' : 'FORMA';
    const url = coffee ? 'projects/terra-coffee/' : 'projects/forma-construction/';
    const description = coffee ? copy[lang].projects.featured.description : ({ru:'Сайт строительной компании. Архитектура, проекты и детали.',en:'A construction company website. Architecture, projects and details.',uk:'Сайт будівельної компанії. Архітектура, проєкти й деталі.'}[lang]);
    return `<a class="project-card project-${kind}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${ui().view}: ${title}">
      <div class="project-cover"><div class="project-browser"><div class="project-toolbar"><div class="window-dots"><i></i><i></i><i></i></div><span>${title.toLowerCase()} / ${coffee ? 'coffee & bakery' : 'architecture & construction'}</span><span>↗</span></div><div class="project-image"><img src="${coffee ? 'projects/terra-coffee/terra-hero.jpg' : 'forma-cover.jpg'}" alt="" width="${coffee ? '1500' : '1400'}" height="${coffee ? '1200' : '934'}" loading="lazy"><div class="project-preview-copy"><span>${coffee ? 'a little pause in your day' : 'built around you'}</span><strong>${title}</strong><span>${coffee ? 'COFFEE. PEOPLE. LITTLE RITUALS.' : 'SPACES WITH A FUTURE.'}</span></div></div></div><span class="concept-badge">${ui().concept} / ${number}</span><span class="project-open">${arrow}</span></div>
      <div class="project-caption"><div><span class="project-type">${coffee ? ui().coffee : ui().construction}</span><h3>${title}<span> / ${coffee ? 'Coffee & Bakery' : 'Construction'}</span></h3><p>${esc(description)}</p></div><span class="project-number">0${number}</span></div>
    </a>`;
  }
  function works() { return `<div class="project-grid">${projectCard('coffee', 1)}${projectCard('construction', 2)}</div>`; }
  function serviceIcon(index) {
    const paths = ['<rect x="5" y="6" width="34" height="30" rx="5"/><path d="M5 15h34M11 10.5h.1M16 10.5h.1M12 23h19M12 29h11"/>','<rect x="12" y="7" width="26" height="29" rx="4"/><path d="M7 14H6a3 3 0 0 0-3 3v21a3 3 0 0 0 3 3h23a3 3 0 0 0 3-3M19 16h12M19 23h12M19 30h6"/>','<path d="M34 16A14 14 0 1 0 36 29M34 7v10H24"/><path d="m16 27 5-10 5 10M18 24h6"/>','<path d="M5 8h5l4 22h21l5-16H12M16 23h20"/><circle cx="17" cy="37" r="2"/><circle cx="33" cy="37" r="2"/>'];
    return `<svg viewBox="0 0 44 44" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[index]}</svg>`;
  }
  function home(t) {
    return `<main id="main"><section class="hero"><div class="container hero-grid"><div class="hero-copy"><div class="eyebrow hero-eyebrow"><span class="mini-star">${star}</span>${esc(t.eyebrow)}</div><h1>${heading(t.title)}</h1><p class="hero-intro">${esc(t.intro)}</p><div class="button-row">${link('#selected-work', `${esc(t.primary)} ${arrow}`, 'button button-blue')}${link('brief.html', `${esc(t.secondary)} ${arrow}`, 'text-link hero-secondary')}</div></div><div class="hero-art"><span class="art-corner">WEB / DESIGN / DEVELOPMENT</span><img src="portfolio-hero.svg?v=23" width="720" height="620" alt="" fetchpriority="high"><span class="art-note"><i></i>${ui().independent}</span></div></div><div class="container hero-bottom"><span>${esc(t.ribbon)}</span><a href="#selected-work" class="scroll-cue" aria-label="${ui().work}">↓</a><span>HTML · CSS · JavaScript</span></div></section>
      <section class="section section-work" id="selected-work"><div class="container"><div class="section-heading"><div><span class="eyebrow">01 / ${ui().work}</span><h2>${esc(t.projectsTitle)}</h2></div>${link('projects.html', `${ui().allWork} ${arrow}`, 'text-link')}</div>${works()}<p class="section-footnote">${esc(t.projectsIntro)}</p></div></section>
      <section class="section section-services"><div class="container"><div class="section-heading"><div><span class="eyebrow">02 / ${esc(copy[lang].nav.services)}</span><h2>${esc(t.servicesTitle)}</h2></div><p>${esc(t.servicesIntro)}</p></div><div class="service-rows">${t.services.map(([number,title,description,timing],index) => `<a class="service-row" href="services.html#service-${index + 1}"><span class="row-index">${esc(number)}</span><span class="service-row-icon">${serviceIcon(index)}</span><h3>${esc(title)}</h3><p>${esc(description)}</p><span class="service-timing">${esc(timing)}</span><span class="circle-arrow">${arrow}</span></a>`).join('')}</div></div></section>
      <section class="section section-approach"><div class="container approach-grid"><div class="approach-art"><img src="portfolio-process.svg?v=23" width="500" height="400" alt="" loading="lazy"><span>${ui().from}</span></div><div class="approach-copy"><span class="eyebrow">03 / ${ui().approach}</span><h2>${esc(t.trustTitle)}</h2><div class="principles">${t.trust.map(([number,title,body]) => `<article class="principle"><span>${esc(number)}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></article>`).join('')}</div></div></div></section>
      <section class="section section-process"><div class="container"><div class="section-heading"><div><span class="eyebrow">04 / ${ui().process}</span><h2>${esc(t.processTitle)}</h2></div><p>${esc(t.processIntro)}</p></div><div class="process-grid">${t.process.map(([number,title,body]) => `<article class="process-step"><span class="process-number">${esc(number)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div></div></section>
      <section class="section section-faq"><div class="container faq-layout"><div class="faq-heading"><span class="eyebrow">05 / FAQ</span><h2>${esc(t.faqTitle)}</h2><a class="text-link" href="mailto:${contactEmail}">${ui().faqNote} ${arrow}</a><span class="faq-flower" aria-hidden="true">${star}</span></div><div class="faq-list">${t.faq.map(([question, answer]) => `<details class="faq-item"><summary><span>${esc(question)}</span><span class="faq-plus" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${esc(answer)}</p></div></details>`).join('')}</div></div></section></main>`;
  }
  function pageHero(t, className = '') {
    return `<section class="page-hero ${className}"><div class="container page-hero-grid"><div><span class="eyebrow"><span class="mini-star">${star}</span>${esc(t.eyebrow)}</span><h1>${heading(t.title)}</h1><p>${esc(t.intro)}</p></div><div class="page-hero-emblem" aria-hidden="true">${star}<span>WEB / ${page.toUpperCase()}</span></div></div></section>`;
  }
  function services(t) {
    return `<main id="main">${pageHero(t)}<section class="section service-cards-section"><div class="container service-grid">${t.cards.map(([title,description,features],index) => `<article class="service-card" id="service-${index + 1}"><div class="service-card-top"><span>0${index + 1}</span>${serviceIcon(index)}</div><h2>${esc(title)}</h2><p>${esc(description)}</p><ul>${features.map(feature => `<li>${esc(feature)}</li>`).join('')}</ul>${link('brief.html', `${esc(copy[lang].startProject)} ${arrow}`, 'text-link')}</article>`).join('')}</div></section>
      <section class="section"><div class="container deliverables-grid"><div><span class="eyebrow">${ui().result}</span><h2>${esc(t.includedTitle)}</h2><img class="deliverables-art" src="portfolio-process.svg?v=23" width="500" height="400" alt="" loading="lazy"></div><ul class="check-list">${t.included.map((item,index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${esc(item)}<b aria-hidden="true">✓</b></li>`).join('')}</ul></div></section>
      <section class="section section-soft"><div class="container boundary-grid"><article class="boundary-card"><span class="eyebrow">${lang === 'en' ? 'Clear scope' : lang === 'uk' ? 'Чесно про можливості' : 'Честно о возможностях'}</span><h2>${esc(t.limitsTitle)}</h2><p>${esc(t.limitsText)}</p></article><article class="boundary-card"><span class="eyebrow">${lang === 'en' ? 'A clear process' : lang === 'uk' ? 'Зрозумілий процес' : 'Понятный процесс'}</span><h2>${esc(t.revisionsTitle)}</h2><p>${esc(t.revisionsText)}</p></article></div></section>
      <section class="section"><div class="container timing-layout"><div><span class="eyebrow">${ui().process}</span><h2>${esc(t.timingTitle)}</h2><p>${esc(t.timingNote)}</p></div><div class="timing-list">${t.timing.map(([name,value]) => `<div class="timing-row"><span>${esc(name)}</span><strong>${esc(value)}</strong></div>`).join('')}</div></div></section></main>`;
  }
  function projects(t) {
    return `<main id="main">${pageHero(t,'projects-hero')}<section class="section projects-page-work"><div class="container">${works()}<div class="project-note"><span class="mini-star">${star}</span><div><h2>${esc(t.noteTitle)}</h2><p>${esc(t.noteText)}</p></div>${link('brief.html', `${esc(copy[lang].startProject)} ${arrow}`, 'button button-dark')}</div></div></section></main>`;
  }
  function brief(t) {
    const field = (name,label,placeholder,required = false) => `<label class="form-field"><span>${esc(label)}${required ? ' <b>*</b>' : ''}</span><input name="${name}" type="text" placeholder="${esc(placeholder)}" ${required ? 'required' : ''} ${name === 'name' ? 'autocomplete="name" maxlength="120"' : name === 'reply' ? 'autocomplete="email" maxlength="200"' : 'maxlength="500"'}></label>`;
    const area = (name,label,placeholder,required = false) => `<label class="form-field"><span>${esc(label)}${required ? ' <b>*</b>' : ''}</span><textarea name="${name}" placeholder="${esc(placeholder)}" rows="3" maxlength="4000" ${required ? 'required' : ''}></textarea></label>`;
    return `<main id="main">${pageHero(t)}<section class="section brief-section"><div class="container brief-layout"><aside class="brief-aside"><span class="contact-symbol" aria-hidden="true">${star}</span><h2>${esc(t.directTitle)}</h2><p>${esc(t.directText)}</p><a class="brief-email" href="mailto:${contactEmail}">${contactEmail}${arrow}</a><div class="handoff-note"><span>↗</span><div><strong>${ui().deliver}</strong><p>${ui().scope}</p></div></div></aside><div class="form-card"><div class="form-card-heading"><h2>${esc(t.formTitle)}</h2><span>* ${esc(t.required)}</span></div><form id="brief-form" action="https://formsubmit.co/${contactEmail}" method="post"><input type="hidden" name="_subject" value="${esc(t.emailSubject)}"><input type="hidden" name="_template" value="table"><input type="hidden" name="_url" value="https://webcmaker.github.io/WebCMaker/brief.html"><input type="hidden" name="_next" value="https://webcmaker.github.io/WebCMaker/brief.html?sent=1#form-status"><input class="form-honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="form-row">${field('name',t.name,t.namePlaceholder,true)}${field('reply',t.contact,t.contactPlaceholder,true)}</div><div class="form-row"><label class="form-field"><span>${esc(t.type)}</span><select name="type">${t.typeOptions.map((option,index) => `<option value="${['','landing','business','redesign','unsure','store'][index]}"${index === 0 ? ' selected disabled' : ''}>${esc(option)}</option>`).join('')}</select></label>${field('budget',t.budget,t.budgetPlaceholder)}</div>${area('business',t.business,t.businessPlaceholder,true)}${area('goal',t.goal,t.goalPlaceholder,true)}<details class="form-extra"><summary>${ui().more}<span>+</span></summary><div>${area('audience',t.audience,t.audiencePlaceholder)}${area('pages',t.pages,t.pagesPlaceholder)}${area('functions',t.functions,t.functionsPlaceholder)}${area('materials',t.materials,t.materialsPlaceholder)}${area('style',t.style,t.stylePlaceholder)}${field('timing',t.timing,t.timingPlaceholder)}${area('extra',t.extra,t.extraPlaceholder)}</div></details><div class="form-actions"><button class="button button-blue" type="submit">${esc(t.submit)} ${arrow}</button><button class="copy-brief text-link" type="button">${ui().copy}</button></div><p class="form-note">${esc(t.formNote)} <a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer">${ui().privacy} ↗</a></p><p class="form-status" id="form-status" role="status" aria-live="polite"></p><div class="mail-fallback" id="mail-fallback" hidden>${ui().submitFallback} <a href="mailto:${contactEmail}">${contactEmail}</a>.</div></form></div></div></section></main>`;
  }
  function captureDraft() {
    const form = document.getElementById('brief-form');
    if (!form) return null;
    return { fields: Array.from(form.elements).filter(element => element.name && !element.name.startsWith('_')).map(element => [element.name,element.value]), extra: !!form.querySelector('.form-extra')?.open };
  }
  function render(draft = null) {
    stopMotion();
    const t = copy[lang];
    document.body.classList.remove('menu-open');
    document.documentElement.lang = lang;
    document.title = ui()[`${page}Title`];
    const content = page === 'services' ? services(t.services) : page === 'projects' ? projects(t.projects) : page === 'brief' ? brief(t.brief) : home(t.home);
    document.getElementById('app').innerHTML = header(t) + content + footer(t);
    document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
      if (lang === button.dataset.language) return;
      const draft = captureDraft();
      lang = button.dataset.language;
      try { localStorage.setItem(storageKey,lang); } catch (_) {}
      render(draft);
    }));
    const year = document.querySelector('.current-year');
    if (year) year.textContent = new Date().getFullYear();
    const form = document.getElementById('brief-form');
    if (form && draft) {
      draft.fields.forEach(([name,value]) => { const element = form.elements.namedItem(name); if (element) element.value = value; });
      form.querySelector('.form-extra').open = draft.extra;
    }
    setupMenu();
    setupBrief();
    setupMotion();
  }
  function setupMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    const close = () => { toggle.setAttribute('aria-expanded','false'); nav.classList.remove('open'); document.body.classList.remove('menu-open'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded',String(open));
      nav.classList.toggle('open',open);
      document.body.classList.toggle('menu-open',open);
    });
    nav.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click',close));
    toggle.addEventListener('keydown',event => { if (event.key === 'Escape') close(); });
    nav.addEventListener('keydown',event => { if (event.key === 'Escape') { close(); toggle.focus(); } });
  }
  function setupBrief() {
    const form = document.getElementById('brief-form');
    if (!form) return;
    const status = document.getElementById('form-status');
    const bodyText = () => Array.from(form.elements).filter(element => element.name && !element.name.startsWith('_') && element.closest('label') && String(element.value).trim()).map(element => {
      const label = element.closest('label').querySelector('span').textContent.replace('*','').trim();
      const value = element.tagName === 'SELECT' ? element.options[element.selectedIndex].text : element.value;
      return `${label}\n${value}`;
    }).join('\n\n');
    // Native POST also works without JavaScript; the service handles spam checks.
    // A return URL confirms acceptance by the service, not inbox delivery.
    try {
      if (new URLSearchParams(window.location.search).get('sent') === '1') {
        status.textContent = ui().sent;
        status.classList.add('is-success');
      }
    } catch (_) {}
    form.addEventListener('submit', () => { status.textContent = copy[lang].brief.mailOpened; });
    form.querySelector('.copy-brief').addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard not available');
        await navigator.clipboard.writeText(bodyText());
        status.textContent = ui().copied;
      } catch (_) {
        status.textContent = ui().copyError;
        document.getElementById('mail-fallback').hidden = false;
      }
    });
  }
  function setupMotion() {
    stopMotion = () => {};
    if (motionPreference.matches || typeof document.documentElement.animate !== 'function' || !('IntersectionObserver' in window)) return;
    const animations = new Set();
    const revealed = new WeakSet();
    const cleanups = [];
    let active = true;
    const play = (element, frames, options) => {
      if (!active || !element.isConnected) return null;
      try {
        const animation = element.animate(frames, { fill: 'none', ...options });
        animations.add(animation);
        animation.onfinish = animation.oncancel = () => animations.delete(animation);
        return animation;
      } catch (_) { return null; }
    };
    const revealObserver = new IntersectionObserver(entries => {
      if (!active) return;
      entries.forEach(entry => {
        if (!entry.isIntersecting || !entry.target.isConnected || revealed.has(entry.target)) return;
        revealed.add(entry.target);
        revealObserver.unobserve(entry.target);
        const siblings = Array.from(entry.target.parentElement.children);
        const delay = Math.min(siblings.indexOf(entry.target), 3) * 55;
        play(entry.target, [
          { opacity: .3, transform: 'translate3d(0, 20px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ], { duration: 650, delay, fill: 'backwards', easing: 'cubic-bezier(.22,1,.36,1)' });
      });
    }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
    const targets = document.querySelectorAll('main .section-heading, main .project-card, main .service-row, main .approach-art, main .approach-copy, main .process-step, main .faq-heading, main .faq-item, main .service-card, main .check-list li, main .boundary-card, main .timing-layout, main .brief-aside, main .form-card, .footer-top');
    targets.forEach(element => {
      // Prerendered, already-visible content must never flash or become hidden.
      if (element.getBoundingClientRect().top >= window.innerHeight) revealObserver.observe(element);
    });
    cleanups.push(() => revealObserver.disconnect());
    const artwork = document.querySelector('.hero-art');
    if (artwork) {
      const artObserver = new IntersectionObserver(entries => {
        if (active) entries.forEach(entry => artwork.classList.toggle('motion-active', entry.isIntersecting));
      }, { threshold: 0 });
      artObserver.observe(artwork);
      cleanups.push(() => { artObserver.disconnect(); artwork.classList.remove('motion-active'); });
    }
    document.querySelectorAll('.faq-item, .form-extra').forEach(details => {
      const panel = details.querySelector('.faq-answer') || details.querySelector('div');
      if (!panel) return;
      let animation = null;
      const onToggle = () => {
        if (animation) animation.cancel();
        if (!active || !details.open || motionPreference.matches) return;
        animation = play(panel, [
          { opacity: .25, transform: 'translateY(-6px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' });
      };
      details.addEventListener('toggle', onToggle);
      cleanups.push(() => details.removeEventListener('toggle', onToggle));
    });
    stopMotion = () => {
      active = false;
      cleanups.forEach(cleanup => cleanup());
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
  }
  motionPreference.addEventListener?.('change', () => {
    stopMotion();
    if (!motionPreference.matches) setupMotion();
  });
  const desktopViewport = window.matchMedia('(min-width: 901px)');
  desktopViewport.addEventListener?.('change', event => {
    if (!event.matches) return;
    document.body.classList.remove('menu-open');
    document.querySelector('.main-nav')?.classList.remove('open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
  });
  render();
})();
