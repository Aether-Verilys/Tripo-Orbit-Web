<script setup lang="ts">
import { computed, ref } from 'vue';
import { useElementVisibility, useIntervalFn } from '@vueuse/core';
import { Check } from 'lucide-vue-next';

const icons = import.meta.glob<string>('../assets/formats/*.webp', { eager: true, import: 'default' });
const iconFor = (fmt: string) => icons[`../assets/formats/${fmt}.webp`];

// An unrecognised 3D file on the left becomes an pebblecroft-associated file on the right, one format after another
const FORMATS = ['glb', 'fbx', 'obj', 'gltf', 'stl', 'usd', 'ply', '3mf'];

const root = ref<HTMLElement | null>(null);
const visible = useElementVisibility(root);

// `pending` is the unknown file waiting on the left; `opened` is what Orbit shows on the right
const pending = ref(1);
const opened = ref(0);
const sends = ref(0);
const busy = ref(false);

const pendingFmt = computed(() => FORMATS[pending.value]);
const openedFmt = computed(() => FORMATS[opened.value]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const send = async () => {
  if (busy.value) return;
  busy.value = true;
  sends.value++;
  await sleep(420); // pulse reaches the right-hand file
  opened.value = pending.value;
  await sleep(380);
  pending.value = (pending.value + 1) % FORMATS.length;
  busy.value = false;
};

const { pause, resume } = useIntervalFn(() => { if (visible.value) send(); }, 2600);

// Clicking sends right away, then the idle cycle starts counting again from zero
const onClick = () => {
  pause();
  send();
  resume();
};

// Both files lean towards the pointer
const tilt = ref({ x: 0, y: 0 });
const onMove = (e: PointerEvent) => {
  const r = root.value!.getBoundingClientRect();
  tilt.value = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
};
const tiltStyle = computed(() => ({ transform: `rotateY(${tilt.value.x * 14}deg) rotateX(${-tilt.value.y * 14}deg)` }));
</script>

<template>
  <button
    ref="root"
    type="button"
    translate="no"
    class="notranslate group relative flex items-center justify-center gap-4 sm:gap-7 mx-auto px-6 py-4 rounded-3xl cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand/60"
    style="perspective: 600px"
    aria-label="Open the next 3D file in Tripo Orbit"
    @click="onClick"
    @pointermove="onMove"
    @pointerleave="tilt = { x: 0, y: 0 }"
  >
    <!-- Unknown file -->
    <div class="flex flex-col items-center gap-2 w-24">
      <div class="transition-transform duration-200 ease-out" :style="tiltStyle">
        <div :key="pending" class="unknown-bob relative w-16 h-20 sm:w-20 sm:h-[6.25rem] drop-shadow-[0_10px_18px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300" :class="{ 'file-send': busy }">
          <svg viewBox="0 0 80 100" class="absolute inset-0 w-full h-full overflow-visible">
            <!-- White sheet with a folded corner, matching the Orbit file icons on the right -->
            <path d="M10 4h40l22 22v64a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6z" fill="#f1f1f3" />
            <path d="M50 4l22 22H56a6 6 0 0 1-6-6z" fill="#d4d4d9" />
          </svg>
          <span class="absolute inset-0 flex items-center justify-center pt-4 font-display font-bold text-4xl sm:text-5xl text-[#9a9aa1]">?</span>
        </div>
      </div>
      <span :key="pending" class="file-in font-mono text-xs text-white/40">model.{{ pendingFmt }}</span>
    </div>

    <!-- Arrow -->
    <div class="relative w-16 sm:w-28 h-6 shrink-0 -mt-6">
      <svg viewBox="0 0 112 24" preserveAspectRatio="none" class="absolute inset-0 w-full h-full overflow-visible">
        <line x1="0" y1="12" x2="100" y2="12" class="arrow-dash" stroke="#F9CF00" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round" vector-effect="non-scaling-stroke" />
      </svg>
      <svg viewBox="0 0 12 16" class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-4 text-brand transition-transform duration-300 group-hover:translate-x-1">
        <path d="M2 2l8 6-8 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <!-- Pulse that carries the file across -->
      <span v-if="sends" :key="sends" class="arrow-pulse absolute top-1/2 w-2.5 h-2.5 -mt-[0.3125rem] -ml-[0.3125rem] rounded-full bg-brand shadow-[0_0_12px_4px_rgba(249,207,0,0.6)]"></span>
    </div>

    <!-- The same file once Orbit owns it -->
    <div class="flex flex-col items-center gap-2 w-24">
      <div class="transition-transform duration-200 ease-out" :style="tiltStyle">
        <div class="relative w-16 h-20 sm:w-20 sm:h-[6.25rem] group-hover:scale-105 transition-transform duration-300">
          <span class="absolute inset-[-30%] rounded-full bg-brand/20 blur-2xl"></span>
          <span :key="`ring-${opened}`" class="open-ring absolute inset-0 m-auto w-16 h-16 rounded-full border-2 border-brand"></span>
          <img :key="opened" :src="iconFor(openedFmt)" class="open-pop relative w-full h-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.5)]" :alt="openedFmt" />
        </div>
      </div>
      <span :key="opened" class="file-in flex items-center gap-1 font-mono text-xs text-brand">
        model <Check class="w-3 h-3" />
      </span>
    </div>
  </button>
</template>

<style scoped>
@keyframes unknown-bob {
  0%, 100% { translate: 0 0; rotate: -3deg; }
  50% { translate: 0 -5px; rotate: 3deg; }
}
.unknown-bob {
  animation: file-in 0.35s ease-out both, unknown-bob 3.2s ease-in-out infinite;
}

@keyframes file-in {
  from { opacity: 0; transform: translateY(8px) scale(0.9); }
  to { opacity: 1; transform: none; }
}
.file-in {
  animation: file-in 0.35s ease-out both;
}

/* The unknown file leans into the arrow and fades as it is handed over */
@keyframes file-send {
  0% { opacity: 1; transform: none; }
  100% { opacity: 0; transform: translateX(26px) scale(0.75); }
}
.file-send {
  animation: file-send 0.5s ease-in 0.25s both;
}

@keyframes arrow-dash {
  to { stroke-dashoffset: -24; }
}
.arrow-dash {
  animation: arrow-dash 0.9s linear infinite;
}

@keyframes arrow-pulse {
  0% { left: 0; opacity: 0; transform: scale(0.4); }
  20% { opacity: 1; transform: scale(1); }
  100% { left: 100%; opacity: 0; transform: scale(1.6); }
}
.arrow-pulse {
  animation: arrow-pulse 0.5s ease-in both;
}

@keyframes open-pop {
  0% { transform: scale(0.6) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.12) rotate(3deg); opacity: 1; }
  100% { transform: none; opacity: 1; }
}
.open-pop {
  animation: open-pop 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
}

@keyframes open-ring {
  from { transform: scale(0.6); opacity: 0.9; }
  to { transform: scale(2); opacity: 0; }
}
.open-ring {
  animation: open-ring 0.6s ease-out both;
}
</style>
