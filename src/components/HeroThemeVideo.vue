<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useElementVisibility } from '@vueuse/core';
import darkVideo from '../assets/themes/dark.mp4';
import darkPoster from '../assets/themes/dark.webp';
import studioVideo from '../assets/themes/studio.mp4';
import studioPoster from '../assets/themes/studio.webp';
import gridVideo from '../assets/themes/grid.mp4';
import gridPoster from '../assets/themes/grid.webp';
import blueprintVideo from '../assets/themes/blueprint.mp4';
import blueprintPoster from '../assets/themes/blueprint.webp';
import gradientVideo from '../assets/themes/gradient.mp4';
import gradientPoster from '../assets/themes/gradient.webp';

defineProps<{ frameStyle?: Record<string, string> }>();

// One recording per viewport theme, cycled on a fixed beat, starting on the dark one; the incoming theme wipes in from the left.
// Every clip is exactly one period of the character's idle animation, cut to start on the same pose,
// so the same currentTime shows the same pose in all of them and each one loops seamlessly.
const THEMES = [
  { name: 'Dark Mode', src: darkVideo, poster: darkPoster },
  { name: 'Studio', src: studioVideo, poster: studioPoster },
  { name: 'Grid', src: gridVideo, poster: gridPoster },
  { name: 'Blueprint', src: blueprintVideo, poster: blueprintPoster },
  { name: 'Gradient', src: gradientVideo, poster: gradientPoster },
];
const DWELL = 3000; // ms each theme stays on screen
const WIPE = 900; // ms of the left-to-right wipe, matches .wipe-layer
const PREROLL = 700; // ms before a switch that the next clip is lined up and starts decoding
const LEAD = 0.02; // s added when lining a clip up, covers the time the seek and start take

const root = ref<HTMLElement | null>(null);
const visible = useElementVisibility(root);
const videos = ref<HTMLVideoElement[]>([]);
const active = ref(0);
const prev = ref(-1); // stays painted underneath while the active clip wipes over it
const wiping = ref(false); // the wipe's mask exists only while it runs; a masked video layer is costly to composite
const cycle = ref(0); // re-keys the chip fill so its timer animation restarts with every switch

let dwellTimer = 0;
let prerollTimer = 0;
let settleTimer = 0;
let switchId = 0;

const clearTimers = () => {
  clearTimeout(dwellTimer);
  clearTimeout(prerollTimer);
};

// Line a clip up with the one on screen and start it. The seek happens while the clip is still hidden, and a clip
// that the pre-roll already started keeps running in step with the visible one, so it is never seeked twice.
const ready = (i: number) => new Promise<void>((resolve) => {
  const v = videos.value[i];
  const cur = videos.value[active.value];
  const dur = v.duration || cur.duration;
  if (v.paused && i !== active.value && dur) v.currentTime = (cur.currentTime + LEAD) % dur;
  const start = () => { v.play().catch(() => {}); if (v.readyState >= 3 && !v.seeking) resolve(); else v.addEventListener('playing', () => resolve(), { once: true }); };
  if (v.seeking) v.addEventListener('seeked', start, { once: true });
  else start();
});

const schedule = () => {
  clearTimers();
  if (!visible.value) return;
  const next = (active.value + 1) % THEMES.length;
  prerollTimer = window.setTimeout(() => ready(next), DWELL - PREROLL);
  dwellTimer = window.setTimeout(() => go(next), DWELL);
};

const go = async (i: number) => {
  if (i === active.value) return;
  const id = ++switchId;
  clearTimers();
  await ready(i);
  if (id !== switchId) return;
  prev.value = active.value;
  active.value = i;
  wiping.value = true;
  cycle.value++;
  schedule();
  // Once the wipe has covered the old clip, drop the mask and stop decoding everything that is off screen
  clearTimeout(settleTimer);
  settleTimer = window.setTimeout(() => {
    wiping.value = false;
    prev.value = -1;
    videos.value.forEach((el, k) => { if (k !== active.value) el.pause(); });
  }, WIPE);
};

// Only decode while the viewer is on screen; coming back restarts the current theme's beat
watch(visible, (on) => {
  if (on) {
    videos.value[active.value]?.play().catch(() => {});
    cycle.value++;
    schedule();
  } else {
    clearTimers();
    videos.value.forEach((el) => el.pause());
  }
});

onMounted(() => {
  if (visible.value) {
    videos.value[0]?.play().catch(() => {});
    schedule();
  }
});
onUnmounted(() => {
  clearTimers();
  clearTimeout(settleTimer);
});
</script>

<template>
  <div ref="root">
    <div
      :style="frameStyle"
      class="relative w-full aspect-[1262/714] rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7),0_10px_30px_-5px_rgba(249,207,0,0.15)]"
    >
      <div
        v-for="(theme, i) in THEMES"
        :key="theme.name"
        class="layer absolute inset-y-0 left-0 w-full"
        :class="[i === active ? 'z-20' : i === prev ? 'z-10' : 'invisible', { 'wipe-layer': wiping && i === active }]"
      >
        <video
          :ref="(el) => { if (el) videos[i] = el as HTMLVideoElement; }"
          :src="theme.src"
          :poster="theme.poster"
          width="1262"
          height="714"
          muted
          loop
          playsinline
          preload="auto"
          class="layer-video block h-full w-full object-cover"
          :class="{ 'wipe-video': wiping && i === active }"
        />
      </div>
    </div>

    <!-- Theme switcher: the active chip fills over the time its theme stays on screen -->
    <div translate="no" class="notranslate flex flex-wrap items-center justify-center gap-2 mt-6">
      <button
        v-for="(theme, i) in THEMES"
        :key="theme.name"
        type="button"
        class="relative overflow-hidden px-4 py-1.5 rounded-full text-sm border transition-colors duration-300 cursor-pointer"
        :class="i === active ? 'border-brand/50 text-brand' : 'border-white/10 text-white/50 hover:text-white/80 hover:border-white/25'"
        :aria-pressed="i === active"
        @click="go(i)"
      >
        <span
          v-if="i === active"
          :key="cycle"
          class="chip-fill absolute inset-y-0 left-0 w-full bg-brand/15"
          :style="{ animationDuration: `${DWELL}ms`, animationPlayState: visible ? 'running' : 'paused' }"
        ></span>
        <span class="relative">{{ theme.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/*
 * Soft-edged left-to-right wipe made only of transforms, so the browser composites it on the GPU instead of
 * repainting a huge masked video every frame (animating mask-position did, and dropped frames on large windows).
 * The layer is 3x the frame wide and carries a static mask (opaque on the left, fading out in the middle);
 * sliding the layer right moves the mask across, while the video inside slides the opposite way to stay put.
 */
@keyframes wipe-layer {
  from { transform: translateX(-55%); }
  to { transform: translateX(0); }
}
@keyframes wipe-video {
  from { transform: translateX(165%); }
  to { transform: translateX(0); }
}
.wipe-layer {
  width: 300%;
  mask-image: linear-gradient(90deg, #000 45%, transparent 55%);
  will-change: transform;
  animation: wipe-layer 0.9s cubic-bezier(0.65, 0, 0.35, 1) both;
}
.wipe-video {
  width: 33.3334%;
  will-change: transform;
  animation: wipe-video 0.9s cubic-bezier(0.65, 0, 0.35, 1) both;
}

@keyframes chip-fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
.chip-fill {
  transform-origin: left;
  animation: chip-fill linear both;
}

@media (prefers-reduced-motion: reduce) {
  .wipe-layer { width: 100%; mask-image: none; animation: none; }
  .wipe-video { width: 100%; animation: none; }
}
</style>
