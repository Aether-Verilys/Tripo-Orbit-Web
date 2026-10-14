import type { Directive } from 'vue';

const onMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
};

// Pairs with the .spotlight class in index.css; the element must be positioned.
export const vSpotlight: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('spotlight');
    el.addEventListener('mousemove', onMove);
  },
  unmounted(el) {
    el.removeEventListener('mousemove', onMove);
  },
};
