(() => {
  'use strict';

  const products = [...document.querySelectorAll('.product')];
  const tabs = [...document.querySelectorAll('[data-filter]')];
  const search = document.getElementById('menu-search');
  const controls = document.querySelector('.menu-controls');
  const count = document.getElementById('menu-count');
  const empty = document.querySelector('.menu-empty');
  const reset = document.querySelector('.reset-filter');
  const featured = document.querySelector('.featured-menu');
  const list = document.querySelector('.menu-list');
  let filter = 'all';

  const normalise = value => value.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();
  const positionWord = value => {
    const lastTwo = value % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return 'позиций';
    if (value % 10 === 1) return 'позиция';
    if (value % 10 >= 2 && value % 10 <= 4) return 'позиции';
    return 'позиций';
  };

  function updateMenu() {
    const query = normalise(search.value);
    let matches = 0;
    for (const product of products) {
      const categoryMatches = filter === 'all' || product.dataset.category === filter;
      const haystack = normalise(product.querySelector('.product-name').textContent + ' ' + product.querySelector('.product-description').textContent + ' ' + product.dataset.search);
      const textMatches = query.split(/\s+/).every(word => haystack.includes(word));
      product.hidden = !(categoryMatches && textMatches);
      if (!product.hidden) matches += 1;
    }
    count.textContent = `${matches} ${positionWord(matches)}`;
    empty.hidden = matches !== 0;
    reset.hidden = filter === 'all' && query === '';
    const featuredCount = [...featured.children].filter(product => !product.hidden).length;
    featured.hidden = featuredCount === 0;
    featured.classList.toggle('filtered', featuredCount < 4);
    featured.classList.toggle('single', featuredCount === 1);
    list.hidden = [...list.children].every(product => product.hidden);
    list.classList.toggle('without-featured', featuredCount === 0);
    for (const tab of tabs) {
      const active = tab.dataset.filter === filter;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    }
  }

  if (controls && search && count && empty && reset && featured && list) {
    controls.hidden = false;
    for (const tab of tabs) tab.addEventListener('click', () => {
      filter = tab.dataset.filter;
      updateMenu();
    });
    search.addEventListener('input', updateMenu);
    reset.addEventListener('click', () => {
      filter = 'all';
      search.value = '';
      updateMenu();
      search.focus();
    });
    updateMenu();
  }

  const productDialog = document.getElementById('product-dialog');
  const visitDialog = document.getElementById('visit-dialog');
  const returnFocus = new WeakMap();

  function showDialog(dialog, trigger) {
    returnFocus.set(dialog, trigger);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }

  for (const dialog of [productDialog, visitDialog]) {
    if (!dialog || typeof dialog.showModal !== 'function') continue;
    dialog.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (!productDialog.open && !visitDialog.open) document.body.classList.remove('dialog-open');
      const trigger = returnFocus.get(dialog);
      if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
    });
  }

  if (productDialog && typeof productDialog.showModal === 'function') {
    const categoryNames = { coffee: 'Кофе', cold: 'Холодный кофе', bakery: 'Выпечка и завтраки' };
    for (const product of products) {
      const button = product.querySelector('[data-open-product]');
      const inline = product.querySelector('.product-inline-details');
      button.hidden = false;
      inline.hidden = true;
      button.addEventListener('click', () => {
        productDialog.querySelector('#dialog-product-name').textContent = product.querySelector('.product-name').textContent;
        productDialog.querySelector('#dialog-product-category').textContent = categoryNames[product.dataset.category];
        productDialog.querySelector('.dialog-product-note').textContent = product.querySelector('.product-note').textContent;
        productDialog.querySelector('#dialog-product-volume').textContent = product.querySelector('.product-volume').textContent;
        productDialog.querySelector('#dialog-product-price').textContent = product.querySelector('.product-price').textContent;
        productDialog.querySelector('#dialog-product-ingredients').textContent = product.querySelector('.product-ingredients').textContent;
        productDialog.querySelector('#dialog-product-allergens').textContent = product.querySelector('.product-allergens').textContent;
        const sourceImage = product.querySelector('.product-photo img');
        const photo = productDialog.querySelector('.dialog-photo');
        const image = photo.querySelector('img');
        photo.hidden = !sourceImage;
        productDialog.classList.toggle('no-photo', !sourceImage);
        if (sourceImage) {
          image.src = sourceImage.src;
          image.srcset = sourceImage.srcset;
          image.sizes = '(max-width: 700px) calc(100vw - 44px), 420px';
          image.width = sourceImage.width;
          image.height = sourceImage.height;
          image.alt = sourceImage.alt;
        } else {
          image.alt = '';
          image.removeAttribute('srcset');
          image.removeAttribute('sizes');
        }
        showDialog(productDialog, button);
      });
    }
  }

  const plannerButton = document.getElementById('open-visit-planner');
  const form = document.getElementById('visit-form');
  const createPlan = document.getElementById('create-visit-plan');
  if (visitDialog && typeof visitDialog.showModal === 'function' && plannerButton && form && createPlan) {
    const day = form.elements.namedItem('day');
    const time = form.elements.namedItem('time');
    const guests = form.elements.namedItem('guests');
    const result = form.querySelector('.planner-result');
    const resultText = result.querySelector('p');
    const today = new Date();
    const localDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    day.min = localDay;
    form.autocomplete = 'off';
    createPlan.disabled = false;
    plannerButton.hidden = false;
    plannerButton.addEventListener('click', () => {
      day.value = localDay;
      showDialog(visitDialog, plannerButton);
    });
    const buildPlan = () => {
      if (!form.reportValidity()) return;
      const date = new Date(`${day.value}T12:00:00`);
      const dateLabel = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long' }).format(date);
      const guestWord = guests.value === '1' ? 'человек' : 'человека';
      resultText.textContent = `${dateLabel} · ${time.value} · ${guests.value} ${guestWord}. Это только ваш план на экране, не подтверждение брони.`;
      result.hidden = false;
    };
    createPlan.addEventListener('click', buildPlan);
    form.addEventListener('submit', event => {
      event.preventDefault();
      buildPlan();
    });
    for (const field of [day, time, guests]) field.addEventListener('change', () => { result.hidden = true; });
    visitDialog.addEventListener('close', () => {
      form.reset();
      result.hidden = true;
      resultText.textContent = '';
    });
  }
})();
