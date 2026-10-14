<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMediaQuery } from '@vueuse/core';
import OrbitWindow from './OrbitWindow.vue';
import { useDemoLoop } from '../../composables/useDemoLoop';
import glbIcon from '../../assets/formats/glb.webp';
import viewportVideo from '../../assets/viewport.mp4';
import viewportPoster from '../../assets/viewport-poster.webp';

const { t, n } = useI18n();

// Load time shown in the demo; matches the "~500 ms for a 1M-face model" note under the panel
const LOAD_MS = 500;

const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

const stage = ref<HTMLElement | null>(null);
const video = ref<HTMLVideoElement | null>(null);

const fileIcon = ref<HTMLElement | null>(null);
const cursor = ref({ x: 0, y: 0 });
const clicks = ref(0);
const windowOpen = ref(false);
const phase = ref<'idle' | 'loading' | 'docking' | 'loaded'>('idle');
const elapsed = ref(0);

const LOAD_LABEL = (LOAD_MS / 1000).toFixed(2);
const bigDigits = ref<HTMLElement | null>(null);
const badgeDigits = ref<HTMLElement | null>(null);
let flight: Animation | undefined;

// Badge copy split around the digits, so they can be a separate landing target
const badgeText = computed(() => t('demo.perf.loadedIn', { t: '\u0000' }).split('\u0000'));

// Shrinks the centred digits onto the badge's digits
const dock = async () => {
  const from = bigDigits.value?.getBoundingClientRect();
  const to = badgeDigits.value?.getBoundingClientRect();
  if (!bigDigits.value || !from || !to || !from.height) return;
  const scale = to.height / from.height;
  flight = bigDigits.value.animate(
    [
      { transform: 'translate(0, 0) scale(1)', color: '#fff' },
      { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})`, color: '#F9CF00' },
    ],
    { duration: 480, easing: 'cubic-bezier(0.6, 0, 0.2, 1)', fill: 'forwards' },
  );
  await flight.finished.catch(() => {});
};

// Cursor targets in stage pixels, measured live so they hold in both the stacked and landscape layouts
const stagePoint = (fx: number, fy: number) => {
  const r = stage.value?.getBoundingClientRect();
  return { x: (r?.width ?? 0) * fx, y: (r?.height ?? 0) * fy };
};
const fileIconPoint = () => {
  const s = stage.value?.getBoundingClientRect();
  const i = fileIcon.value?.getBoundingClientRect();
  if (!s || !i) return stagePoint(0.1, 0.15);
  return { x: i.left - s.left + i.width * 0.6, y: i.top - s.top + i.height * 0.6 };
};

const countUp = () =>
  new Promise<void>((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      elapsed.value = Math.min(LOAD_MS, now - start);
      if (elapsed.value < LOAD_MS) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });

useDemoLoop(stage, async (wait) => {
  windowOpen.value = false;
  phase.value = 'idle';
  flight?.cancel();
  elapsed.value = 0;
  cursor.value = stagePoint(0.5, 0.9);
  video.value?.pause();
  if (video.value) video.value.currentTime = 0;
  await wait(700);

  // Move to the file and double-click it
  cursor.value = fileIconPoint();
  await wait(900);
  clicks.value++;
  await wait(160);
  clicks.value++;
  await wait(120);

  windowOpen.value = true;
  await wait(380);

  phase.value = 'loading';
  cursor.value = stagePoint(0.6, 0.75);
  await countUp();
  await wait(120);
  phase.value = 'docking';
  video.value?.play().catch(() => {});
  if (!reducedMotion.value) await dock();
  await wait(0);
  phase.value = 'loaded';

  await wait(6500);
  windowOpen.value = false;
  await wait(600);
});
</script>

<template>
  <div ref="stage" class="relative w-full h-full">
    <!-- Desktop file -->
    <div class="absolute left-[6%] top-[4%] sm:left-0 sm:top-[8%] flex flex-col items-center gap-1 w-20">
      <div class="relative">
        <img ref="fileIcon" :src="glbIcon" class="w-12 h-12 md:w-14 md:h-14 drop-shadow-lg" alt="GLB file" />
        <span
          v-for="c in Math.min(clicks, 2)"
          :key="clicks - c"
          class="click-ring absolute inset-0 m-auto w-8 h-8 rounded-full border-2 border-brand"
        ></span>
      </div>
      <span translate="no" class="notranslate px-1.5 rounded text-[11px] text-white/80" :class="{ 'bg-brand/30': clicks > 0 && !windowOpen }">Trinity.glb</span>
    </div>

    <!-- App window, scaling out of the file icon -->
    <div
      class="absolute left-0 right-0 top-[24%] sm:left-auto sm:top-[3%] sm:h-[94%] sm:aspect-[4/3] transition-[transform,opacity] origin-[8%_-30%] sm:origin-[-18%_18%]"
      :class="windowOpen ? 'opacity-100 scale-100 duration-[420ms] ease-[cubic-bezier(0.2,0.9,0.3,1.15)]' : 'opacity-0 scale-[0.08] duration-300 ease-in'"
    >
      <OrbitWindow title="Tripo Orbit - Trinity.glb" class="aspect-square sm:aspect-auto sm:h-full">
        <video
          ref="video"
          :src="viewportVideo"
          :poster="viewportPoster"
          muted
          loop
          playsinline
          preload="auto"
          class="absolute inset-0 w-full h-full object-cover transition-[opacity,filter] duration-500"
          :class="phase === 'docking' || phase === 'loaded' ? 'opacity-100 blur-0' : 'opacity-0 blur-md'"
        />

        <!-- Progress bar under the big timer -->
        <div
          class="absolute left-1/4 right-1/4 top-[calc(50%+1.5rem)] h-0.5 rounded-full bg-white/10 overflow-hidden transition-opacity duration-200"
          :class="phase === 'loading' ? 'opacity-100' : 'opacity-0'"
        >
          <div class="h-full bg-brand" :style="{ width: `${(elapsed / LOAD_MS) * 100}%` }"></div>
        </div>

        <!-- Big timer: counts up in the centre, then its digits fly into the badge -->
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
          :class="phase === 'loading' || phase === 'docking' ? 'visible' : 'invisible'"
        >
          <span class="font-display text-2xl md:text-3xl font-bold italic tabular-nums whitespace-nowrap">
            <span ref="bigDigits" class="inline-block origin-top-left text-white">{{ (elapsed / 1000).toFixed(2) }}</span>
            <span class="text-brand text-lg transition-opacity duration-150" :class="phase === 'loading' ? 'opacity-100' : 'opacity-0'">s</span>
          </span>
        </div>

        <!-- Result badge; its digits stay hidden until the flying ones land on them -->
        <div
          class="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 border border-brand/40 text-brand text-[10px] font-mono whitespace-nowrap transition-opacity duration-300"
          :class="phase === 'docking' || phase === 'loaded' ? 'opacity-100' : 'opacity-0'"
        >
          ⚡ {{ badgeText[0] }}<span ref="badgeDigits" class="inline-block font-display font-bold italic tabular-nums" :class="phase === 'loaded' ? 'visible' : 'invisible'">{{ LOAD_LABEL }}</span>{{ badgeText[1] }}
        </div>

        <template #panel>
          <p class="text-white/80 mb-1.5">Shading Mode</p>
          <div class="grid grid-cols-2 gap-1 mb-3">
            <span class="demo-chip">Solid</span>
            <span class="demo-chip demo-chip-on">Textured</span>
            <span class="demo-chip">Normal</span>
          </div>
          <p class="text-white/80 mb-1.5">Theme</p>
          <div class="grid grid-cols-2 gap-1">
            <span class="demo-chip">Studio</span>
            <span class="demo-chip demo-chip-on">Dark</span>
            <span class="demo-chip">Grid</span>
            <span class="demo-chip">Blueprint</span>
          </div>
        </template>

        <template #status>
          <span>{{ n(18908) }} {{ t('demo.faces') }}</span>
          <span class="text-white/20">·</span>
          <span>{{ n(11456) }} {{ t('demo.verts') }}</span>
        </template>
      </OrbitWindow>
    </div>

    <!-- Cursor -->
    <svg
      class="absolute w-5 h-5 -ml-0.5 -mt-0.5 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-[left,top] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] z-10"
      :style="{ left: `${cursor.x}px`, top: `${cursor.y}px` }"
      viewBox="0 0 24 24"
    >
      <path d="M4 2l16 10.5-7 1.5-3.5 7z" fill="white" stroke="black" stroke-width="1.2" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<style scoped>
@keyframes click-ring {
  from { transform: scale(0.6); opacity: 1; }
  to { transform: scale(2.2); opacity: 0; }
}
.click-ring {
  animation: click-ring 0.5s ease-out forwards;
}
</style>
