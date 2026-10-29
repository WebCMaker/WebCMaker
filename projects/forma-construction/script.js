(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start'});
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
    nav.classList.remove('open');
  };
  if (menuToggle && nav) {
    menuToggle.hidden = false;
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      nav.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const directionNames = {house: 'Строительство дома', reconstruction: 'Реконструкция', finishing: 'Внутренняя отделка'};
  const finishNames = {prepared: 'Подготовка под отделку', finished: 'Чистовая отделка', complete: 'Комплексный проект'};
  const readinessNames = {needed: 'Нужна разработка проекта', ready: 'Проект уже есть', review: 'Нужна проверка проекта'};
  const state = {scope: 'house', area: 120, finish: 'prepared', readiness: 'needed'};
  const areaField = document.getElementById('project-area');
  const areaRange = document.getElementById('project-area-range');
  const finishField = document.getElementById('project-finish');
  const readinessField = document.getElementById('project-readiness');
  const requestService = document.getElementById('request-service');
  const configurationOutput = document.getElementById('request-configuration');
  const commentField = document.getElementById('request-comment');
  const form = document.getElementById('project-request');
  let lastRequest = '';
  const resetRequest = () => {
    lastRequest = '';
    document.getElementById('request-result').hidden = true;
    document.getElementById('request-summary').textContent = '';
    document.getElementById('copy-status').textContent = '';
  };

  const configurationLine = () => `${state.area} м² · ${finishNames[state.finish]} · ${readinessNames[state.readiness]}`;
  const checklist = () => {
    const first = {house: 'Исходные данные участка', reconstruction: 'Обследование существующего объекта', finishing: 'Проверка готовности поверхностей'}[state.scope];
    const project = {needed: 'Разработка проектных решений', ready: 'Сверка с готовым проектом', review: 'Проверка проектных решений'}[state.readiness];
    const core = {house: 'Конструктив и инженерная подготовка', reconstruction: 'Планировка и обновление инженерии', finishing: 'Подготовка оснований и материалов'}[state.scope];
    const result = {prepared: 'Подготовка к внутренней отделке', finished: 'Чистовые покрытия и детали', complete: 'Объединение этапов в общий план'}[state.finish];
    return [first, project, core, result];
  };
  const renderConfiguration = () => {
    document.getElementById('config-result-title').textContent = directionNames[state.scope];
    document.getElementById('area-output').value = String(state.area);
    document.getElementById('finish-output').textContent = finishNames[state.finish];
    const list = document.getElementById('config-checklist');
    list.replaceChildren(...checklist().map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    configurationOutput.value = configurationLine();
    requestService.value = state.scope;
    document.getElementById('config-status').textContent = '';
    resetRequest();
  };
  const setScope = (scope) => {
    if (!Object.prototype.hasOwnProperty.call(directionNames, scope)) return;
    state.scope = scope;
    document.querySelectorAll('input[name="scope"]').forEach(input => { input.checked = input.value === scope; });
    renderConfiguration();
  };
  document.querySelectorAll('input[name="scope"]').forEach(input => input.addEventListener('change', () => setScope(input.value)));
  const readArea = value => {
    const number = Number(value);
    return Math.max(40, Math.min(400, Math.round(String(value).trim() !== '' && Number.isFinite(number) ? number : 120)));
  };
  areaRange.addEventListener('input', () => {
    state.area = readArea(areaRange.value);
    areaField.value = String(state.area);
    renderConfiguration();
  });
  areaField.addEventListener('input', () => {
    if (areaField.value === '' || !Number.isFinite(Number(areaField.value))) return;
    state.area = readArea(areaField.value);
    areaRange.value = String(state.area);
    renderConfiguration();
  });
  areaField.addEventListener('change', () => {
    state.area = readArea(areaField.value);
    areaField.value = String(state.area);
    areaRange.value = String(state.area);
    renderConfiguration();
  });
  finishField.addEventListener('change', () => { state.finish = finishField.value; renderConfiguration(); });
  readinessField.addEventListener('change', () => { state.readiness = readinessField.value; renderConfiguration(); });
  requestService.addEventListener('change', () => setScope(requestService.value));
  document.getElementById('use-configuration').addEventListener('click', () => {
    renderConfiguration();
    document.getElementById('config-status').textContent = 'Параметры добавлены в черновик ниже.';
    scrollToSection('contact');
    commentField.focus({preventScroll: true});
  });

  // This demo deliberately has no network submission and stores no entered data.
  form.addEventListener('submit', event => event.preventDefault());
  commentField.addEventListener('input', resetRequest);
  document.getElementById('prepare-request').addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const comment = commentField.value.trim();
    lastRequest = [
      'FORMA — демонстрационный черновик',
      directionNames[state.scope],
      `Площадь: ${state.area} м²`,
      `Результат: ${finishNames[state.finish]}`,
      `Проект: ${readinessNames[state.readiness]}`,
      '',
      'Предварительный состав работ:',
      ...checklist().map(item => `— ${item}`),
      ...(comment ? ['', 'Комментарий:', comment] : []),
      '',
      'Демонстрация. Заявка не отправлена.'
    ].join('\n');
    const result = document.getElementById('request-result');
    document.getElementById('request-summary').textContent = lastRequest;
    document.getElementById('copy-status').textContent = '';
    result.hidden = false;
    result.focus({preventScroll: true});
    result.scrollIntoView({behavior: reduceMotion() ? 'auto' : 'smooth', block: 'nearest'});
  });
  document.getElementById('copy-request').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    if (!lastRequest) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(lastRequest);
      status.textContent = 'Черновик скопирован.';
    } catch {
      status.textContent = 'Не удалось скопировать автоматически. Выделите текст черновика и скопируйте его вручную.';
    }
  });

  const galleries = {
    light: [
      {src: 'forma-interior.webp', width: 960, height: 653, alt: 'Светлая общая зона с натуральными материалами', caption: 'Визуальное направление: общая зона'},
      {src: 'forma-concrete.webp', width: 640, height: 960, alt: 'Подготовка бетонного основания перед дальнейшими работами', caption: 'Иллюстрация этапа: подготовка основания', fit: 'contain'}
    ],
    slope: [
      {src: '../../forma-house.webp', srcset: '../../forma-house-small.webp 640w, ../../forma-house.webp 800w', width: 800, height: 1200, alt: 'Современный светлый дом на стальных опорах среди деревьев', caption: 'Визуальное направление: дом и рельеф', fit: 'contain'},
      {src: 'forma-building.webp', width: 960, height: 640, alt: 'Монолитный каркас строящегося здания в горном ландшафте', caption: 'Иллюстрация этапа: монолитный каркас'},
      {src: 'forma-structure.webp', width: 768, height: 960, alt: 'Конструктив здания и подъёмный кран', caption: 'Иллюстрация этапа: работа с конструктивом', fit: 'contain'}
    ]
  };
  const initializedGalleries = new WeakSet();
  const setupGalleries = (root) => {
    root.querySelectorAll('[data-gallery]').forEach(gallery => {
      if (initializedGalleries.has(gallery)) return;
      initializedGalleries.add(gallery);
      const slides = galleries[gallery.dataset.gallery];
      if (!slides?.length) return;
      let index = 0;
      const image = gallery.querySelector('[data-gallery-image]');
      const show = nextIndex => {
        index = (nextIndex + slides.length) % slides.length;
        const slide = slides[index];
        image.src = slide.src;
        image.width = slide.width;
        image.height = slide.height;
        image.style.objectFit = slide.fit || 'cover';
        image.alt = slide.alt;
        if (slide.srcset) {
          image.srcset = slide.srcset;
          image.sizes = '(max-width: 600px) calc(100vw - 60px), 900px';
        } else {
          image.removeAttribute('srcset');
          image.removeAttribute('sizes');
        }
        gallery.querySelector('[data-gallery-caption]').textContent = slide.caption;
        gallery.querySelector('[data-gallery-count]').textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      };
      gallery.addEventListener('click', event => {
        const button = event.target instanceof Element ? event.target.closest('[data-gallery-step]') : null;
        if (button) show(index + Number(button.dataset.galleryStep));
      });
      gallery.addEventListener('keydown', event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1));
      });
      show(0);
    });
  };
  setupGalleries(document);

  const dialog = document.getElementById('project-dialog');
  const dialogContent = document.getElementById('project-dialog-content');
  const supportsDialog = dialog && typeof dialog.showModal === 'function';
  let lastTrigger = null;
  let restoreDialogFocus = true;
  const closeProjectDialog = (restoreFocus = true) => {
    restoreDialogFocus = restoreFocus;
    if (dialog?.open) dialog.close();
  };
  if (supportsDialog) {
    document.documentElement.classList.add('has-project-dialog');
    document.querySelectorAll('[data-case]').forEach(trigger => trigger.addEventListener('click', event => {
      const source = document.getElementById(trigger.dataset.case)?.querySelector('.case-content');
      if (!source) return;
      event.preventDefault();
      lastTrigger = trigger;
      restoreDialogFocus = true;
      const content = source.cloneNode(true);
      content.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      dialogContent.replaceChildren(content);
      document.getElementById('project-dialog-title').textContent = source.dataset.caseName;
      document.getElementById('project-dialog-kind').textContent = source.dataset.caseKind;
      setupGalleries(dialogContent);
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('dialog-open');
      dialog.querySelector('.dialog-close').focus({preventScroll: true});
    }));
    dialog.querySelector('.dialog-close').addEventListener('click', () => closeProjectDialog());
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      if (restoreDialogFocus) lastTrigger?.focus({preventScroll: true});
      lastTrigger = null;
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeProjectDialog();
    });
  } else {
    document.querySelectorAll('[data-case]').forEach(trigger => trigger.addEventListener('click', () => {
      const fallback = document.getElementById(trigger.dataset.case);
      if (fallback) fallback.open = true;
    }));
  }
  document.addEventListener('click', event => {
    const trigger = event.target instanceof Element ? event.target.closest('[data-pick-service], [data-use-case]') : null;
    if (!trigger) return;
    event.preventDefault();
    if (trigger.dataset.caseArea) {
      state.area = readArea(trigger.dataset.caseArea);
      areaField.value = String(state.area);
      areaRange.value = String(state.area);
    }
    setScope(trigger.dataset.pickService || trigger.dataset.useCase);
    closeProjectDialog(false);
    closeMenu();
    scrollToSection('configurator');
    document.querySelector('input[name="scope"]:checked')?.focus({preventScroll: true});
  });
  renderConfiguration();
})();
