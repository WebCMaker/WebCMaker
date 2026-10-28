/* Rebuild the four static RU pages after editing content.js or app.js.
 * Run: node prerender.cjs [site-root]. Uses Node built-ins only.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(process.argv[2] || __dirname);
const copySource = fs.readFileSync(path.join(root, 'content.js'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const base = 'https://webcmaker.github.io/WebCMaker/';
const pages = [
  { page: 'home', file: 'index.html', canonical: base, description: 'WebCMaker — дизайн и разработка лендингов и небольших сайтов. Адаптивная вёрстка и готовые файлы для вашего проекта.' },
  { page: 'projects', file: 'projects.html', canonical: base + 'projects.html', description: 'Учебные концепты WebCMaker: кофейня TERRA и строительная компания FORMA. Дизайн и работающие сайты.' },
  { page: 'services', file: 'services.html', canonical: base + 'services.html', description: 'Лендинги, сайты-визитки и редизайн от WebCMaker. Дизайн, адаптивная вёрстка и передача исходных файлов.' },
  { page: 'brief', file: 'brief.html', canonical: base + 'brief.html', description: 'Расскажите WebCMaker о вашем проекте: формат сайта, задача и пожелания. Связь: webcmaker@gmail.com.' }
];

const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

function render(page, file) {
  const output = { innerHTML: '' };
  const year = { textContent: '' };
  const noop = () => {};
  const classList = { add: noop, remove: noop, toggle: noop, contains: () => false };
  const storage = { getItem: () => 'ru', setItem: noop, removeItem: noop };
  const document = {
    body: { dataset: { page }, classList, style: {} },
    documentElement: { lang: 'ru', classList, style: {} },
    title: '',
    getElementById: id => id === 'app' ? output : null,
    querySelector: selector => selector === '.current-year' ? year : null,
    querySelectorAll: () => [],
    addEventListener: noop,
    removeEventListener: noop
  };
  const context = {
    document, localStorage: storage, sessionStorage: storage,
    location: { href: base + file, pathname: '/WebCMaker/' + file, search: '', hash: '' },
    navigator: { language: 'ru', clipboard: { writeText: async () => {} } },
    console, URL, URLSearchParams,
    addEventListener: noop, removeEventListener: noop, scrollTo: noop,
    matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }),
    requestAnimationFrame: callback => { callback(0); return 1; }, cancelAnimationFrame: noop,
    setTimeout, clearTimeout
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(copySource, context, { filename: 'content.js', timeout: 5000 });
  vm.runInContext(appSource, context, { filename: 'app.js', timeout: 5000 });
  const markup = output.innerHTML;
  assert.ok(markup.length > 1000 && /<main\b/.test(markup), `${file}: no meaningful rendered page`);
  assert.equal([...markup.matchAll(/<h1\b/g)].length, 1, `${file}: expected one h1`);
  assert.ok(markup.includes('mailto:webcmaker@gmail.com'), `${file}: missing email link`);
  assert.ok(!/\bundefined\b|\[object Object\]/.test(markup), `${file}: unresolved content`);
  assert.ok(document.title.includes('WebCMaker'), `${file}: missing document title`);
  return { markup, title: document.title };
}

const rendered = pages.map(page => {
  const { markup, title } = render(page.page, page.file);
  const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#fafaf9">
  <meta name="description" content="${escape(page.description)}">
  <title>${escape(title)}</title>
  <link rel="canonical" href="${page.canonical}">
  <link rel="icon" href="favicon.svg?v=20" type="image/svg+xml">
  <link rel="preload" href="manrope-variable.ttf" as="font" type="font/ttf" crossorigin="anonymous">
  <link rel="stylesheet" href="styles.css?v=20">
  <script defer src="content.js?v=20"></script>
  <script defer src="app.js?v=20"></script>
</head>
<body data-page="${page.page}">
  <noscript><p class="container noscript-note">JavaScript отключён. Для обсуждения проекта напишите на <a href="mailto:webcmaker@gmail.com">webcmaker@gmail.com</a>.</p></noscript>
  <div id="app">${markup}</div>
</body>
</html>
`;
  return { ...page, title, html };
});

for (const page of rendered) fs.writeFileSync(path.join(root, page.file), page.html, 'utf8');
console.log(JSON.stringify({ root, prerendered: rendered.map(page => ({ file: page.file, title: page.title, bytes: Buffer.byteLength(page.html) })) }, null, 2));
