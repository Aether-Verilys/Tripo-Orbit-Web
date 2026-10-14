import { onUnmounted, ref, type Ref } from 'vue';
import { useIntersectionObserver, usePreferredReducedMotion } from '@vueuse/core';

export type Wait = (ms: number) => Promise<void>;

const CANCELLED = Symbol('cancelled');

/**
 * Plays an async scene on repeat while `target` is on screen, and cancels it the moment it
 * scrolls away. Each run gets a `wait` that throws once the run is superseded, so a scene can
 * be written as straight-line code. With reduced motion the scene runs once with no delays,
 * landing directly on its final frame.
 */
export function useDemoLoop(target: Ref<HTMLElement | null>, scene: (wait: Wait) => Promise<void>) {
  const reducedMotion = usePreferredReducedMotion();
  const visible = ref(false);
  let token = 0;

  const run = async () => {
    const mine = ++token;
    const reduced = reducedMotion.value === 'reduce';
    const wait: Wait = (ms) =>
      new Promise((resolve, reject) => {
        if (mine !== token) return reject(CANCELLED);
        if (reduced) return resolve();
        setTimeout(() => (mine === token ? resolve() : reject(CANCELLED)), ms);
      });

    try {
      do {
        await scene(wait);
      } while (!reduced && mine === token);
    } catch (e) {
      if (e !== CANCELLED) throw e;
    }
  };

  const stop = () => { token++; };

  useIntersectionObserver(
    target,
    ([entry]) => {
      const now = !!entry?.isIntersecting;
      if (now === visible.value) return;
      visible.value = now;
      if (now) run();
      else stop();
    },
    { threshold: 0.35 },
  );

  onUnmounted(stop);

  return {
    visible,
    // Abandons the current run and starts the scene over, e.g. after the viewer changes what it shows
    restart: () => {
      stop();
      if (visible.value) run();
    },
  };
}
