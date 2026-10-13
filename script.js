document.body.classList.add("has-js");
const themeButton = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeGlyph = themeButton?.querySelector(".theme-glyph");
const themeLabel = themeButton?.querySelector(".theme-label");
const readThemePreference = () => {
  try {
    return localStorage.getItem("srinath-bhu-portfolio-theme");
  } catch {
    return null;
  }
};
const setTheme = (theme, remember = false) => {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeButton?.setAttribute("aria-pressed", String(isDark));
  themeButton?.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  if (themeGlyph) themeGlyph.textContent = isDark ? "☼" : "☾";
  if (themeLabel) themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  themeMeta?.setAttribute("content", isDark ? "#191a18" : "#f7f3eb");
  if (remember) {
    try {
      localStorage.setItem("srinath-bhu-portfolio-theme", isDark ? "dark" : "light");
    } catch {}
  }
};
setTheme(readThemePreference() === "dark" ? "dark" : "light");
themeButton?.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
});

const menuButton = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");

if (menuButton && siteNavigation) {
  const mobileNavigation = window.matchMedia("(max-width: 700px)");
  const setMenuOpen = (isOpen, { returnFocus = false, moveFocus = false } = {}) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    siteNavigation.classList.toggle("is-open", isOpen);
    siteNavigation.inert = mobileNavigation.matches && !isOpen;
    if (isOpen && moveFocus) siteNavigation.querySelector("a")?.focus();
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true", { moveFocus: true });
  });

  siteNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (event) => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen && !siteNavigation.contains(event.target) && !menuButton.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, { returnFocus: true });
    }
  });

  mobileNavigation.addEventListener("change", () => setMenuOpen(false));
  setMenuOpen(false);
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const toolsToggle = document.querySelector(".tools-toggle");
toolsToggle?.addEventListener("click", () => {
  const isPaused = toolsToggle.getAttribute("aria-pressed") !== "true";
  toolsToggle.setAttribute("aria-pressed", String(isPaused));
  toolsToggle.textContent = isPaused ? "Resume tools" : "Pause tools";
  document.querySelector(".tools-line")?.classList.toggle("is-paused", isPaused);
});

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealItems = document.querySelectorAll("[data-reveal], [data-draw-line], [data-assembly], [data-hero-sequence]");

if ("IntersectionObserver" in window && revealItems.length && !motionPreference.matches) {
  document.body.classList.add("has-reveal");

  const revealObserver = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -7% 0px",
    threshold: 0.12
  });

  revealItems.forEach((item) => revealObserver.observe(item));

  motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      revealObserver.disconnect();
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  });
}

const counters = document.querySelectorAll("[data-counter]");
if ("IntersectionObserver" in window && counters.length && !motionPreference.matches) {
  const formatCounter = (element, value) => {
    const decimals = Number(element.dataset.decimals || 0);
    const suffix = element.dataset.suffix || "";
    const rounded = decimals ? Number(value.toFixed(decimals)) : Math.round(value);
    const formatted = rounded.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    element.textContent = `${element.dataset.prefix || ""}${formatted}${suffix}`;
  };

  const counterObserver = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const endValue = Number(element.dataset.counter);
      const duration = 880;
      const start = performance.now();

      const tick = (now) => {
        if (motionPreference.matches) {
          formatCounter(element, endValue);
          return;
        }
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        formatCounter(element, endValue * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      currentObserver.unobserve(element);
    });
  }, { threshold: 0.55 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

const header = document.querySelector(".site-header");
const parallaxPreference = window.matchMedia("(min-width: 1000px) and (hover: hover) and (pointer: fine)");
const decorativeScraps = [...document.querySelectorAll(".hero-art .paper-cut")];
let heroOnScreen = true;
if ("IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroOnScreen = entry.isIntersecting;
  });
  heroObserver.observe(document.querySelector(".hero"));
}
let scrollUpdatePending = false;
const updateHeader = () => {
  header?.classList.toggle("is-compact", window.scrollY > 64);
  if (heroOnScreen && parallaxPreference.matches && !motionPreference.matches) {
    const progress = Math.min(1, window.scrollY / 850);
    decorativeScraps.forEach((scrap, index) => {
      scrap.style.translate = `0 ${progress * (index ? -12 : 12)}px`;
    });
  }
  scrollUpdatePending = false;
};

window.addEventListener("scroll", () => {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  window.requestAnimationFrame(updateHeader);
}, { passive: true });
updateHeader();
const resetParallax = () => {
  decorativeScraps.forEach((scrap) => { scrap.style.translate = "none"; });
};
motionPreference.addEventListener("change", resetParallax);
parallaxPreference.addEventListener("change", resetParallax);

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && navLinks.length && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, {
    rootMargin: "-28% 0px -62% 0px",
    threshold: 0
  });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

document.addEventListener("visibilitychange", () => {
  document.documentElement.classList.toggle("is-page-hidden", document.hidden);
});
