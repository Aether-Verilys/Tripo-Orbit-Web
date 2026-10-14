import type { Directive } from 'vue';

const observers = new WeakMap<HTMLElement, IntersectionObserver>();

// Toggles `is-in` as the element scrolls into view, and clears it once it has fully left,
// so the entrance defined by the .reveal-* classes in index.css replays on every visit.
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.35) el.classList.add('is-in');
        else if (!entry.isIntersecting) el.classList.remove('is-in');
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(el);
    observers.set(el, observer);
  },
  unmounted(el) {
    observers.get(el)?.disconnect();
  },
};
