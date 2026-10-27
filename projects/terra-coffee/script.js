(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
    siteNav.classList.toggle("open", !isOpen);
  });

  siteNav?.querySelectorAll("a").forEach((anchor) => anchor.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Открыть меню");
    siteNav.classList.remove("open");
  }));

  const tabs = [...document.querySelectorAll(".menu-tab")];
  const dishes = [...document.querySelectorAll(".menu-card")];
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    dishes.forEach((dish) => {
      dish.hidden = filter !== "all" && dish.dataset.category !== filter;
    });
  }));
})();

