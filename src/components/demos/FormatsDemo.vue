<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Check, Upload } from 'lucide-vue-next';
import OrbitWindow from './OrbitWindow.vue';
import { useDemoLoop } from '../../composables/useDemoLoop';
import viewportVideo from '../../assets/viewport.mp4';
import viewportPoster from '../../assets/viewport-poster.webp';
import macIcon from '../../assets/mac.webp';
import winIcon from '../../assets/windows.webp';

const icons = import.meta.glob<string>('../../assets/formats/*.webp', { eager: true, import: 'default' });
const iconFor = (fmt: string) => icons[`../../assets/formats/${fmt.toLowerCase()}.webp`];

// One still per format so each file that lands shows a different model; GLB plays the real viewport recording instead
const models = import.meta.glob<string>('../../assets/models/*.webp', { eager: true, import: 'default' });
const modelFor = (fmt: string) => models[`../../assets/models/${fmt.toLowerCase()}.webp`];

const { t } = useI18n();

// Formats Orbit opens, per the FAQ, in the order they fly in; USD covers .usd/.usda/.usdc/.usdz
const FORMATS = ['GLB', 'FBX', 'OBJ', 'GLTF', 'STL', 'USD', 'PLY', '3MF', 'PMX'];

type Flyer = { id: number; fmt: string; from: { x: number; y: number } };

const stage = ref<HTMLElement | null>(null);
const windowEl = ref<HTMLElement | null>(null);
const viewportEl = ref<HTMLElement | null>(null);
const video = ref<HTMLVideoElement | null>(null);

const flyers = ref<Flyer[]>([]);
const loaded = ref<Set<string>>(new Set());
const lastFmt = ref<string | null>(null);
const flashKey = ref(0);
let nextId = 0;

const allLoaded = computed(() => loaded.value.size === FORMATS.length);
const title = computed(() => (lastFmt.value ? `Tripo Orbit - model.${lastFmt.value.toLowerCase()}` : 'Tripo Orbit'));

const centerOf = (el: Element) => {
  const s = stage.value!.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top };
};

// Somewhere just outside the left, top or right edge of the stage
const randomEdge = () => {
  const { width, height } = stage.value!.getBoundingClientRect();
  const side = Math.floor(Math.random() * 3);
  if (side === 0) return { x: -40, y: Math.random() * height * 0.6 };
  if (side === 1) return { x: Math.random() * width, y: -50 };
  return { x: width + 40, y: Math.random() * height * 0.6 };
};

const impact = (fmt: string) => {
  loaded.value = new Set(loaded.value).add(fmt);
  lastFmt.value = fmt;
  flashKey.value++;
  if (fmt === 'GLB') video.value?.play().catch(() => {});
  else video.value?.pause();
  windowEl.value?.animate(
    [
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${(Math.random() - 0.5) * 8}px, 5px) scale(0.975)` },
      { transform: 'translate(0, -2px) scale(1.008)' },
      { transform: 'translate(0, 0) scale(1)' },
    ],
    { duration: 280, easing: 'ease-out' },
  );
};

const throwFile = async (fmt: string, from = randomEdge()) => {
  if (!stage.value || !viewportEl.value) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return impact(fmt);
  const id = nextId++;
  flyers.value.push({ id, fmt, from });
  await nextTick();

  const el = stage.value.querySelector<HTMLElement>(`[data-flyer="${id}"]`);
  const to = centerOf(viewportEl.value);
  const jitter = { x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 30 };
  const mid = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 60 - Math.random() * 60 };
  const spin = (Math.random() - 0.5) * 120;

  const anim = el?.animate(
    [
      { transform: `translate(${from.x}px, ${from.y}px) rotate(0deg) scale(1)`, opacity: 1 },
      { transform: `translate(${mid.x}px, ${mid.y}px) rotate(${spin / 2}deg) scale(1.1)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${to.x + jitter.x}px, ${to.y + jitter.y}px) rotate(${spin}deg) scale(0.35)`, opacity: 0.9 },
    ],
    { duration: 420 + Math.random() * 80, easing: 'cubic-bezier(0.45, 0, 0.85, 0.4)', fill: 'forwards' },
  );
  await anim?.finished.catch(() => {});
  flyers.value = flyers.value.filter((f) => f.id !== id);
  impact(fmt);
};

const throwFromTray = (fmt: string, e: MouseEvent) => {
  throwFile(fmt, centerOf(e.currentTarget as Element));
};

useDemoLoop(stage, async (wait) => {
  loaded.value = new Set();
  lastFmt.value = null;
  video.value?.pause();
  await wait(500);

  // One file at a time, in list order, each held long enough for its model to register
  for (const fmt of FORMATS) {
    await throwFile(fmt);
    await wait(450);
  }

  await wait(2200);
});
</script>

<template>
  <div ref="stage" class="relative w-full h-full flex flex-col sm:flex-row-reverse items-center justify-center gap-5">
    <div ref="windowEl" class="w-full sm:w-auto sm:flex-1 sm:min-w-0 relative">
      <OrbitWindow :title="title" class="aspect-[1/1.05] sm:aspect-[4/3]">
        <div ref="viewportEl" class="absolute inset-0">
          <video
            ref="video"
            :src="viewportVideo"
            :poster="viewportPoster"
            muted
            loop
            playsinline
            preload="auto"
            class="absolute inset-0 w-full h-full object-cover"
            :class="lastFmt === 'GLB' ? 'model-pop' : 'hidden'"
          />
          <img
            v-if="lastFmt && lastFmt !== 'GLB'"
            :key="lastFmt"
            :src="modelFor(lastFmt)"
            class="model-pop absolute inset-0 w-full h-full object-contain p-[6%]"
            alt=""
          />

          <!-- Empty drop zone -->
          <div
            class="absolute inset-3 rounded-lg border border-dashed border-white/15 flex flex-col items-center justify-center gap-1.5 text-white/35 transition-opacity duration-300"
            :class="lastFmt ? 'opacity-0' : 'opacity-100'"
          >
            <Upload class="w-5 h-5" />
            <span>{{ t('demo.formats.drop') }}</span>
          </div>

          <!-- Impact flash -->
          <span v-if="flashKey" :key="flashKey" class="impact-flash absolute inset-0 border-2 border-brand rounded-sm pointer-events-none"></span>

          <!-- Toast -->
          <div
            :key="`toast-${flashKey}`"
            class="toast-pop absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-white/10 whitespace-nowrap"
            :class="lastFmt ? '' : 'hidden'"
          >
            <Check class="w-3 h-3 text-brand" />
            <span v-if="allLoaded" class="text-brand">{{ t('demo.formats.all', { n: FORMATS.length }) }}</span>
            <span v-else>{{ t('demo.formats.loaded', { fmt: lastFmt }) }}</span>
          </div>
        </div>

        <template #panel>
          <p class="text-white/80 mb-1.5">Formats</p>
          <ul class="space-y-[3px]">
            <li
              v-for="fmt in FORMATS"
              :key="fmt"
              class="flex items-center justify-between font-mono text-[9px] transition-colors duration-200"
              :class="loaded.has(fmt) ? 'text-white' : 'text-white/30'"
            >
              <span :class="{ 'text-brand': fmt === lastFmt }">.{{ fmt.toLowerCase() }}</span>
              <Check class="w-2.5 h-2.5 transition-[opacity,transform] duration-200" :class="loaded.has(fmt) ? 'opacity-100 scale-100 text-brand' : 'opacity-0 scale-50'" />
            </li>
          </ul>
        </template>
      </OrbitWindow>
    </div>

    <!-- Tray: click to throw a file in yourself -->
    <div class="flex flex-col items-center gap-2 sm:gap-3 sm:w-[116px] sm:shrink-0">
      <div class="flex flex-wrap justify-center gap-1.5 px-4 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-1">
        <button
          v-for="fmt in FORMATS"
          :key="fmt"
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:-translate-y-1 hover:scale-110 active:scale-95 transition-transform duration-200"
          :title="fmt"
          @click="throwFromTray(fmt, $event)"
        >
          <img :src="iconFor(fmt)" class="w-full h-full" :alt="fmt" />
        </button>
      </div>
      <div class="flex sm:flex-col items-center gap-3 sm:gap-2 text-[11px] text-white/35 text-center">
        <span>{{ t('demo.formats.hint') }}</span>
        <span class="w-px h-3 sm:w-8 sm:h-px bg-white/15"></span>
        <div class="flex items-center gap-2">
          <img :src="macIcon" class="w-4 h-4 opacity-70" alt="Mac" />
          <img :src="winIcon" class="w-3.5 h-3.5 opacity-70" alt="Windows" />
        </div>
      </div>
    </div>

    <!-- Files in flight, positioned by the Web Animations transforms -->
    <img
      v-for="f in flyers"
      :key="f.id"
      :data-flyer="f.id"
      :src="iconFor(f.fmt)"
      class="absolute left-0 top-0 w-10 h-10 md:w-12 md:h-12 -ml-5 -mt-5 md:-ml-6 md:-mt-6 pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] z-20"
      :style="{ transform: `translate(${f.from.x}px, ${f.from.y}px)` }"
      alt=""
    />
  </div>
</template>

<style scoped>
@keyframes impact-flash {
  from { opacity: 0.9; box-shadow: inset 0 0 30px rgba(249, 207, 0, 0.5); }
  to { opacity: 0; box-shadow: inset 0 0 0 rgba(249, 207, 0, 0); }
}
.impact-flash {
  animation: impact-flash 0.45s ease-out forwards;
}

@keyframes model-pop {
  from { opacity: 0; transform: scale(0.82); filter: blur(6px); }
  to { opacity: 1; transform: scale(1); filter: blur(0); }
}
.model-pop {
  animation: model-pop 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
}

@keyframes toast-pop {
  /* Horizontal centring comes from the -translate-x-1/2 utility; only animate the rise here */
  0% { transform: translateY(6px) scale(0.9); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.toast-pop {
  animation: toast-pop 0.25s ease-out;
}
</style>
