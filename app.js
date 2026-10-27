(function () {
  const copy = window.WEBIT_COPY;
  const supported = ["ru", "en", "uk"];
  const page = document.body.dataset.page || "home";
  const contactEmail = "webcmaker@gmail.com";
  const storageKey = "webcmaker-language";
  let saved = "";
  try {
    saved = localStorage.getItem(storageKey) || "";
  } catch (error) {
    // Continue with the default language when browser storage is unavailable.
  }
  let lang = supported.includes(saved) ? saved : "ru";

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const link = (href, text, className = "") => `<a class="${className}" href="${href}">${text}</a>`;
  const arrow = '<span aria-hidden="true">↗</span>';

  function header(t) {
    const items = [
      ["home", "index.html"], ["services", "services.html"], ["projects", "projects.html"]
    ];
    return `<a class="skip-link" href="#main">${lang === "ru" ? "К содержимому" : lang === "uk" ? "До вмісту" : "Skip to content"}</a>
      <header class="site-header"><div class="container header-inner">
        <a class="brand" href="index.html" aria-label="WebCMaker — ${esc(t.nav.home)}">
          <span class="brand-mark" aria-hidden="true"><span>W</span></span>
          <span class="brand-name">Web<span>CMaker</span><small>${esc(t.footerLabel)}</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="${lang === "ru" ? "Открыть меню" : lang === "uk" ? "Відкрити меню" : "Open menu"}"><span></span><span></span></button>
        <nav class="main-nav" id="main-nav" aria-label="${lang === "ru" ? "Основная навигация" : lang === "uk" ? "Основна навігація" : "Main navigation"}">
          ${items.map(([key, href]) => link(href, esc(t.nav[key]), page === key ? "nav-link active" : "nav-link")).join("")}
          <div class="language-switch" aria-label="Language">
            ${supported.map((code) => `<button type="button" data-language="${code}" class="language-button${lang === code ? " active" : ""}" aria-pressed="${lang === code}">${code.toUpperCase()}</button>`).join("")}
          </div>
          ${link("brief.html", `${esc(t.nav.brief)} ${arrow}`, "button button-small button-dark nav-cta")}
        </nav>
      </div></header>`;
  }

  function footer(t) {
    return `<footer class="site-footer"><div class="container footer-top">
        <div class="footer-brand"><a class="brand brand-footer" href="index.html"><span class="brand-mark" aria-hidden="true"><span>W</span></span><span class="brand-name">Web<span>CMaker</span></span></a><p>${esc(t.footerLine)}</p></div>
        <div class="footer-column"><span class="footer-heading">${esc(t.contact)}</span><a href="mailto:${contactEmail}">${contactEmail} ${arrow}</a>${link("brief.html", esc(t.nav.brief))}</div>
        <div class="footer-column"><span class="footer-heading">WebCMaker</span>${link("services.html", esc(t.nav.services))}${link("projects.html", esc(t.nav.projects))}${link("brief.html", esc(t.nav.brief))}</div>
      </div><div class="container footer-bottom"><span>© <span class="current-year"></span> WebCMaker</span><span>${esc(t.footerLabel)} · ${esc(t.langName)}</span></div></footer>`;
  }

  function serviceCards(items) {
    return `<div class="service-grid">${items.map(([number, title, description, timing]) => `<article class="service-card reveal"><div class="card-topline"><span>${esc(number)}</span><span class="card-arrow" aria-hidden="true">↗</span></div><h3>${esc(title)}</h3><p>${esc(description)}</p><span class="card-meta">${esc(timing)}</span></article>`).join("")}</div>`;
  }

  function projectPlaceholders(t, slots = [t.projectSlot, t.projectSlot]) {
    return `<div class="project-grid">${slots.map((slot, index) => `<article class="project-card reveal"><div class="project-visual visual-${index + 1}" aria-hidden="true"><div class="browser-bar"><i></i><i></i><i></i><span>WebCMaker</span></div><div class="mock-layout"><div class="mock-label"></div><div class="mock-title"></div><div class="mock-line"></div><div class="mock-line short"></div><div class="mock-button"></div><div class="mock-art"><b></b><i></i></div></div><div class="project-stamp">${String(index + 1).padStart(2, "0")}</div></div><div class="project-caption"><div><span class="eyebrow tiny">${esc(slot)}</span><h3>${esc(t.projectSoon || t.slotLabel)}</h3></div><span class="project-plus" aria-hidden="true">+</span></div></article>`).join("")}</div>`;
  }

  function featuredProjectCard(project) {
    return `<div class="project-grid project-feature-grid"><a class="project-card project-feature-card reveal" href="projects/terra-coffee/" target="_blank" rel="noopener noreferrer" aria-label="${esc(project.linkLabel)}: ${esc(project.title)}">
      <div class="project-visual project-art" aria-hidden="true"><img class="project-art-photo" src="projects/terra-coffee/terra-hero.jpg?v=1" alt="" width="1500" height="1200" loading="lazy"><span class="project-art-index">CONCEPT / 01</span><span class="project-art-mark">T</span><div class="project-art-title">TERRA<span>coffee & bakery</span></div><span class="project-art-bottom">A SMALL RITUAL, DONE WELL</span></div>
      <div class="project-caption"><div><span class="eyebrow tiny">${esc(project.category)}</span><h3>${esc(project.title)}</h3><p>${esc(project.description)}</p><span class="project-feature-link">${esc(project.linkLabel)} ${arrow}</span></div><span class="project-plus" aria-hidden="true">↗</span></div>
    </a></div>`;
  }

  function home(t) {
    return `<main id="main">
      <section class="hero section-pad"><div class="container hero-grid">
        <div class="hero-copy reveal"><span class="eyebrow"><i class="eyebrow-dot"></i>${esc(t.eyebrow)}</span><h1>${esc(t.title)}</h1><p class="hero-intro">${esc(t.intro)}</p><div class="button-row">${link("projects.html", `${esc(t.primary)} ${arrow}`, "button button-lime")}${link("brief.html", esc(t.secondary), "button button-outline")}</div><div class="hero-note"><span class="note-line"></span>${esc(t.ribbon)}</div></div>
        <div class="hero-art reveal" aria-label="${esc(t.previewTitle)}"><div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div><div class="float-tag tag-top"><span class="status-dot"></span>${lang === "ru" ? "В работе" : lang === "uk" ? "У роботі" : "In progress"}</div><div class="browser-card"><div class="browser-top"><div class="browser-dots"><i></i><i></i><i></i></div><span>webcmaker.site</span><span class="browser-menu">•••</span></div><div class="browser-body"><div class="browser-kicker"></div><div class="browser-heading"></div><div class="browser-heading narrow"></div><div class="browser-text"></div><div class="browser-text short"></div><div class="browser-action"></div><div class="browser-sample"><div class="sample-window"><span></span><b></b><i></i><i></i></div><div class="sample-ring"></div><div class="sample-cube"></div></div></div></div><div class="float-tag tag-bottom"><span class="check-icon">✓</span>${lang === "ru" ? "Адаптивный дизайн" : lang === "uk" ? "Адаптивний дизайн" : "Responsive design"}</div><div class="art-glow"></div></div>
      </div><div class="container hero-bottom"><span>${lang === "ru" ? "Дизайн" : lang === "uk" ? "Дизайн" : "Design"}</span><i></i><span>HTML · CSS · JavaScript</span><i></i><span>Figma</span><i></i><span>${lang === "ru" ? "Поддержка" : lang === "uk" ? "Підтримка" : "Support"}</span></div></section>
      <section class="trust-section section-pad"><div class="container"><div class="section-heading reveal"><span class="eyebrow">${lang === "ru" ? "Почему WebCMaker" : lang === "uk" ? "Чому WebCMaker" : "Why WebCMaker"}</span><h2>${esc(t.trustTitle)}</h2></div><div class="trust-grid">${t.trust.map(([num, title, body]) => `<article class="trust-card reveal"><span class="trust-number">${esc(num)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join("")}</div></div></section>
      <section class="section-pad section-muted"><div class="container"><div class="section-heading split-heading reveal"><div><span class="eyebrow">${lang === "ru" ? "Услуги" : lang === "uk" ? "Послуги" : "Services"}</span><h2>${esc(t.servicesTitle)}</h2></div><p>${esc(t.servicesIntro)}</p></div>${serviceCards(t.services)}<p class="fine-print">${esc(t.timingNote)}</p><div class="section-link">${link("services.html", `${esc(copy[lang].serviceLink)} ${arrow}`, "text-link")}</div></div></section>
      <section class="section-pad"><div class="container"><div class="section-heading split-heading reveal"><div><span class="eyebrow">${lang === "ru" ? "Выбранные работы" : lang === "uk" ? "Вибрані роботи" : "Selected work"}</span><h2>${esc(t.projectsTitle)}</h2></div><p>${esc(t.projectsIntro)}</p></div>${featuredProjectCard(copy[lang].projects.featured)}<div class="section-link">${link("projects.html", `${esc(copy[lang].allProjects)} ${arrow}`, "text-link")}</div></div></section>
      <section class="section-pad section-dark"><div class="container"><div class="section-heading split-heading section-heading-light reveal"><div><span class="eyebrow eyebrow-light">${lang === "ru" ? "Процесс" : lang === "uk" ? "Процес" : "Process"}</span><h2>${esc(t.processTitle)}</h2></div><p>${esc(t.processIntro)}</p></div><div class="process-list">${t.process.map(([num, title, body]) => `<article class="process-step reveal"><span class="process-num">${esc(num)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p><span class="process-mark" aria-hidden="true">↗</span></article>`).join("")}</div></div></section>
      <section class="section-pad"><div class="container faq-layout"><div class="section-heading reveal"><span class="eyebrow">FAQ</span><h2>${esc(t.faqTitle)}</h2><p>${lang === "ru" ? "Оставьте вопрос в брифе — вернусь с ответом." : lang === "uk" ? "Залиште запитання у брифі — відповім." : "Leave a question in the brief and I will get back to you."}</p></div><div class="faq-list">${t.faq.map(([q, a]) => `<details class="faq-item reveal"><summary>${esc(q)}<span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join("")}</div></div></section>
      <section class="cta-band"><div class="container cta-inner reveal"><div><span class="eyebrow eyebrow-light">${lang === "ru" ? "Следующий шаг" : lang === "uk" ? "Наступний крок" : "Next step"}</span><h2>${esc(t.finalTitle)}</h2><p>${esc(t.finalText)}</p></div>${link("brief.html", `${esc(t.finalButton)} ${arrow}`, "button button-lime")}</div></section>
    </main>`;
  }

  function services(t) {
    const detailedCards = `<div class="service-grid">${t.cards.map(([title, description, features], index) => `<article class="service-card service-detail-card reveal"><div class="card-topline"><span>${String(index + 1).padStart(2, "0")}</span><span class="card-arrow" aria-hidden="true">↗</span></div><h3>${esc(title)}</h3><p>${esc(description)}</p><ul>${features.map((feature) => `<li>${esc(feature)}</li>`).join("")}</ul></article>`).join("")}</div>`;
    return `<main id="main"><section class="page-hero section-pad"><div class="container page-hero-inner reveal"><span class="eyebrow"><i class="eyebrow-dot"></i>${esc(t.eyebrow)}</span><h1>${esc(t.title)}</h1><p>${esc(t.intro)}</p></div></section>
      <section class="section-pad section-muted"><div class="container">${detailedCards}</div></section>
      <section class="section-pad"><div class="container detail-grid"><div class="section-heading reveal"><span class="eyebrow">${lang === "ru" ? "Состав проекта" : lang === "uk" ? "Склад проєкту" : "Project scope"}</span><h2>${esc(t.includedTitle)}</h2></div><ul class="check-list reveal">${t.included.map((item) => `<li><span>✓</span>${esc(item)}</li>`).join("")}</ul></div></section>
      <section class="section-pad section-soft"><div class="container boundary-grid"><article class="boundary-card reveal"><span class="eyebrow">${lang === "ru" ? "Честно о возможностях" : lang === "uk" ? "Чесно про можливості" : "Clear scope"}</span><h2>${esc(t.limitsTitle)}</h2><p>${esc(t.limitsText)}</p></article><article class="boundary-card boundary-accent reveal"><span class="eyebrow">${lang === "ru" ? "Комфортный процесс" : lang === "uk" ? "Комфортний процес" : "A smooth process"}</span><h2>${esc(t.revisionsTitle)}</h2><p>${esc(t.revisionsText)}</p></article></div></section>
      <section class="section-pad"><div class="container timing-layout"><div class="section-heading reveal"><span class="eyebrow">${lang === "ru" ? "Планирование" : lang === "uk" ? "Планування" : "Planning"}</span><h2>${esc(t.timingTitle)}</h2><p>${esc(t.timingNote)}</p></div><div class="timing-list">${t.timing.map(([name, value]) => `<div class="timing-row reveal"><span>${esc(name)}</span><strong>${esc(value)}</strong></div>`).join("")}</div></div></section>
      <section class="cta-band"><div class="container cta-inner reveal"><div><span class="eyebrow eyebrow-light">WebCMaker</span><h2>${esc(t.ctaTitle)}</h2><p>${esc(t.ctaText)}</p></div>${link("brief.html", `${esc(t.ctaButton)} ${arrow}`, "button button-lime")}</div></section></main>`;
  }

  function projects(t) {
    return `<main id="main"><section class="page-hero section-pad"><div class="container page-hero-inner reveal"><span class="eyebrow"><i class="eyebrow-dot"></i>${esc(t.eyebrow)}</span><h1>${esc(t.title)}</h1><p>${esc(t.intro)}</p></div></section>
      <section class="section-pad section-muted"><div class="container">${featuredProjectCard(t.featured)}</div></section>
      <section class="section-pad"><div class="container portfolio-note reveal"><div class="portfolio-note-icon" aria-hidden="true">✳</div><div><h2>${esc(t.noteTitle)}</h2><p>${esc(t.noteText)}</p></div>${link("brief.html", `${esc(copy[lang].startProject)} ${arrow}`, "button button-dark")}</div></section></main>`;
  }

  function brief(t) {
    const field = (name, label, placeholder, type = "text", required = false) => `<label class="form-field"><span>${esc(label)}${required ? ` <b aria-hidden="true">*</b>` : ""}</span><input type="${type}" name="${name}" placeholder="${esc(placeholder)}" ${required ? "required" : ""} ${type === "email" ? 'autocomplete="email"' : ""}></label>`;
    const textarea = (name, label, placeholder, required = false) => `<label class="form-field"><span>${esc(label)}${required ? ` <b aria-hidden="true">*</b>` : ""}</span><textarea name="${name}" placeholder="${esc(placeholder)}" rows="3" ${required ? "required" : ""}></textarea></label>`;
    return `<main id="main"><section class="page-hero section-pad"><div class="container page-hero-inner reveal"><span class="eyebrow"><i class="eyebrow-dot"></i>${esc(t.eyebrow)}</span><h1>${esc(t.title)}</h1><p>${esc(t.intro)}</p></div></section>
      <section class="section-pad section-muted"><div class="container brief-layout"><div class="brief-aside reveal"><span class="eyebrow">${lang === "ru" ? "Никакого давления" : lang === "uk" ? "Жодного тиску" : "No pressure"}</span><h2>${esc(t.directTitle)}</h2><p>${esc(t.directText)}</p><a class="button button-dark full-button" href="mailto:${contactEmail}">${esc(copy[lang].email)} ${arrow}</a><a class="brief-email" href="mailto:${contactEmail}">${contactEmail}</a><div class="aside-note"><span>↗</span><p>${lang === "ru" ? "Объём, сроки, стоимость и порядок оплаты согласуем до начала работы." : lang === "uk" ? "Обсяг, строки, вартість і порядок оплати погодимо до початку роботи." : "We agree on scope, timeline, cost and payment terms before starting."}</p></div></div>
      <div class="form-card reveal"><h2>${esc(t.formTitle)}</h2><p class="form-required"><b>*</b> ${esc(t.required)}</p><form id="brief-form">
        <div class="form-row">${field("name", t.name, t.namePlaceholder, "text", true)}${field("reply", t.contact, t.contactPlaceholder, "text", true)}</div>
        <label class="form-field"><span>${esc(t.type)}</span><select name="type">${t.typeOptions.map((option, index) => `<option value="${index ? esc(option) : ""}" ${index === 0 ? "selected disabled" : ""}>${esc(option)}</option>`).join("")}</select></label>
        ${textarea("business", t.business, t.businessPlaceholder, true)}
        ${textarea("audience", t.audience, t.audiencePlaceholder)}
        ${textarea("goal", t.goal, t.goalPlaceholder, true)}
        ${textarea("pages", t.pages, t.pagesPlaceholder)}
        ${textarea("functions", t.functions, t.functionsPlaceholder)}
        ${textarea("materials", t.materials, t.materialsPlaceholder)}
        ${textarea("style", t.style, t.stylePlaceholder)}
        <div class="form-row">${field("timing", t.timing, t.timingPlaceholder)}${field("budget", t.budget, t.budgetPlaceholder)}</div>
        ${textarea("extra", t.extra, t.extraPlaceholder)}
        <button class="button button-lime submit-button" type="submit">${esc(t.submit)} ${arrow}</button>
        <p class="form-note">${esc(t.formNote)}</p><p class="form-status" id="form-status" role="status" aria-live="polite"></p>
      </form></div></div></section></main>`;
  }

  function render() {
    const t = copy[lang];
    document.documentElement.lang = lang;
    document.title = `${page === "home" ? "WebCMaker" : `${esc(t.nav[page])} — WebCMaker`}`;
    const content = page === "services" ? services(t.services) : page === "projects" ? projects(t.projects) : page === "brief" ? brief(t.brief) : home(t.home);
    document.getElementById("app").innerHTML = header(t) + content + footer(t);
    document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
      lang = button.dataset.language;
      try {
        localStorage.setItem(storageKey, lang);
      } catch (error) {
        // Language switching still works for the current page.
      }
      render();
    }));
    document.querySelector(".current-year").textContent = new Date().getFullYear();
    setupMenu();
    setupReveal();
    setupBrief(t.brief);
  }

  function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
      document.body.classList.toggle("menu-open", !open);
    });
    nav.querySelectorAll("a").forEach((anchor) => anchor.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
    }));
  }

  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  function setupBrief(t) {
    const form = document.getElementById("brief-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const entries = [...new FormData(form).entries()].filter(([, value]) => String(value).trim());
      const body = entries.map(([key, value]) => `${form.querySelector(`[name="${key}"]`).closest("label").querySelector("span").textContent.replace("*", "").trim()}\n${value}`).join("\n\n");
      const status = document.getElementById("form-status");
      const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(body)}`;
      status.textContent = t.mailOpened;
      window.location.href = mailto;
    });
  }

  render();
})();
