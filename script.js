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

function splitIntoChars(root) {
  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (part.trim() === "") {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const word = document.createElement("span");
          word.className = "word";
          Array.from(part).forEach((ch) => {
            const charEl = document.createElement("span");
            charEl.className = "char";
            charEl.textContent = ch;
            const dx = (Math.random() * 2 - 1) * 70;
            const dy = -20 - Math.random() * 60;
            const rot = (Math.random() * 2 - 1) * 45;
            charEl.style.setProperty("--dx", `${dx.toFixed(1)}px`);
            charEl.style.setProperty("--dy", `${dy.toFixed(1)}px`);
            charEl.style.setProperty("--rot", `${rot.toFixed(1)}deg`);
            word.appendChild(charEl);
          });
          frag.appendChild(word);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(root);
  root.querySelectorAll(".char").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 16, 550)}ms`;
  });
}

if (!reducedMotion) {
  document.querySelectorAll(".char-reveal").forEach(splitIntoChars);
}

const revealTargets = document.querySelectorAll(".reveal, .fade-in, .char-reveal");

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

const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
