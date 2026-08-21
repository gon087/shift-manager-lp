const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobileNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Section fade-up on scroll (headings/cards) */
const revealTargets = document.querySelectorAll(".reveal, .fade-in");

if (reducedMotion) {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => observer.observe(el));
}

/*
 * Scroll-scrubbed character reveal, ported from nob-sakuma.com's own
 * production code (a custom-code block found in its page data): each
 * character starts in the accent color and switches to the dark text
 * color one by one as the paragraph scrolls through a fixed window,
 * driven purely by scroll position (not a timer), so it scrubs both
 * ways as the user scrolls up/down.
 */
function initScrollTextReveal() {
  const elements = Array.from(document.querySelectorAll(".scroll-text"));
  if (elements.length === 0) return;

  const instances = elements.map((element) => {
    const original = element.innerHTML;
    let newContent = "";
    let isTag = false;
    for (let i = 0; i < original.length; i++) {
      const ch = original[i];
      if (ch === "<") isTag = true;
      if (isTag) {
        newContent += ch;
        if (ch === ">") isTag = false;
      } else {
        newContent += /\s/.test(ch) ? ch : `<span class="char">${ch}</span>`;
      }
    }
    element.innerHTML = newContent;
    return {
      element,
      chars: Array.from(element.querySelectorAll(".char")),
      lastActiveCount: -1,
    };
  });

  function updateInstance(inst) {
    if (inst.chars.length === 0) return;
    const windowHeight = window.innerHeight;
    const rect = inst.element.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > windowHeight) return;

    const startPoint = windowHeight * 0.85;
    const scrollRange = rect.height + windowHeight * 0.3;
    const moved = startPoint - rect.top;
    let progress = moved / scrollRange;
    progress = Math.min(1, Math.max(0, progress));

    const activeCount = Math.floor(inst.chars.length * progress);
    if (activeCount !== inst.lastActiveCount) {
      if (activeCount > inst.lastActiveCount) {
        const start = Math.max(0, inst.lastActiveCount);
        for (let i = start; i < activeCount; i++) inst.chars[i]?.classList.add("active");
      } else {
        for (let i = activeCount; i < inst.lastActiveCount; i++) inst.chars[i]?.classList.remove("active");
      }
      inst.lastActiveCount = activeCount;
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        instances.forEach(updateInstance);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  instances.forEach(updateInstance);
}

if (!reducedMotion) {
  initScrollTextReveal();
}

const header = document.querySelector(".site-header");
const onHeaderScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onHeaderScroll, { passive: true });
onHeaderScroll();
