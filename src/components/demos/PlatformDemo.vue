<script setup lang="ts">
import { ref } from 'vue';
import {
  ArrowUp, ChevronLeft, ChevronRight, Clock, Download, FileText, Folder, Home, Image, LayoutGrid,
  Minus, Monitor, Plus, Radio, Rocket, Search, Square, X,
} from 'lucide-vue-next';
import OrbitWindow from './OrbitWindow.vue';
import DemoCursor from './DemoCursor.vue';
import { useDemoLoop, type Wait } from '../../composables/useDemoLoop';
import appIcon from '../../assets/app.webp';
import macIcon from '../../assets/mac.webp';
import winIcon from '../../assets/windows.webp';

const icons = import.meta.glob<string>('../../assets/formats/*.webp', { eager: true, import: 'default' });
const models = import.meta.glob<string>('../../assets/models/*.webp', { eager: true, import: 'default' });

// The same folder of models, browsed on each OS; each still is a cut-out shown over the pane's own background
const FILES = [
  { name: 'motorcycle.glb', fmt: 'glb', type: 'GLB File' },
  { name: 'boat_tavern.fbx', fmt: 'fbx', type: 'FBX File' },
  { name: 'fantasy_queen.obj', fmt: 'obj', type: 'OBJ File' },
  { name: 'leather_satchel.gltf', fmt: 'gltf', type: 'GLTF File' },
  { name: 'spider_demon.stl', fmt: 'stl', type: 'STL File' },
].map((f) => ({
  ...f,
  icon: icons[`../../assets/formats/${f.fmt}.webp`],
  still: models[`../../assets/models/${f.fmt}.webp`],
}));

const SYSTEMS = [
  { id: 'win', label: 'Windows', icon: winIcon },
  { id: 'mac', label: 'macOS', icon: macIcon },
] as const;
type SystemId = (typeof SYSTEMS)[number]['id'];

const WIN_NAV = [
  { label: 'Home', icon: Home },
  { label: 'Gallery', icon: Image },
  { label: 'Desktop', icon: Monitor },
  { label: 'Downloads', icon: Download },
  { label: 'Documents', icon: FileText },
];
const MAC_NAV = [
  { label: 'AirDrop', icon: Radio },
  { label: 'Recents', icon: Clock },
  { label: 'Applications', icon: Rocket },
  { label: 'Downloads', icon: Download },
  { label: 'Documents', icon: FileText },
];

const stage = ref<HTMLElement | null>(null);
const active = ref<SystemId>('win');

// Windows: Explorer selection drives the preview pane
const winEl = ref<HTMLElement | null>(null);
const winRows = ref<HTMLElement[]>([]);
const winSel = ref(-1);
const winCursor = ref({ x: 0, y: 0 });

// macOS: double-clicking a Finder icon opens Orbit
const macEl = ref<HTMLElement | null>(null);
const macItems = ref<HTMLElement[]>([]);
const macSel = ref(-1);
const macOpen = ref(false);
const macClicks = ref(0);
const macCursor = ref({ x: 0, y: 0 });
let macRound = 0;

// Where `target` sits inside `frame`, in the frame's own pixels
const pointIn = (frame: HTMLElement | null, target: HTMLElement | undefined, fx = 0.5, fy = 0.5) => {
  const f = frame?.getBoundingClientRect();
  if (!f) return { x: 0, y: 0 };
  const t = target?.getBoundingClientRect() ?? f;
  return { x: t.left - f.left + t.width * fx, y: t.top - f.top + t.height * fy };
};

const playWindows = async (wait: Wait) => {
  winSel.value = -1;
  winCursor.value = pointIn(winEl.value, undefined, 0.45, 0.85);
  await wait(700);
  for (let i = 0; i < FILES.length; i++) {
    winCursor.value = pointIn(winEl.value, winRows.value[i], 0.4, 0.55);
    await wait(480);
    winSel.value = i;
    await wait(1050);
  }
  await wait(500);
};

const playMac = async (wait: Wait) => {
  macSel.value = -1;
  macOpen.value = false;
  macCursor.value = pointIn(macEl.value, undefined, 0.7, 0.85);
  await wait(700);

  const i = macRound++ % FILES.length;
  macCursor.value = pointIn(macEl.value, macItems.value[i], 0.5, 0.4);
  await wait(650);
  macSel.value = i;
  macClicks.value++;
  await wait(170);
  macClicks.value++;
  await wait(220);
  macOpen.value = true;
  macCursor.value = pointIn(macEl.value, undefined, 0.72, 0.7);
  await wait(3600);
  macOpen.value = false;
  await wait(600);
};

// Each pass plays the system in front, then brings the other one forward
const { restart } = useDemoLoop(stage, async (wait) => {
  if (active.value === 'win') await playWindows(wait);
  else await playMac(wait);
  active.value = active.value === 'win' ? 'mac' : 'win';
  await wait(650);
});

const show = (id: SystemId) => {
  if (active.value === id) return;
  active.value = id;
  restart();
};

const slot = (id: SystemId) =>
  active.value === id
    ? 'left-0 top-[9%] z-10 opacity-100 scale-100'
    : 'left-0 sm:left-[10%] top-0 z-0 opacity-30 scale-[0.94] cursor-pointer';
</script>

<template>
  <div ref="stage" translate="no" class="notranslate relative w-full h-full flex flex-col gap-3 select-none">
    <!-- System switch -->
    <div class="flex justify-center shrink-0">
      <div class="flex p-1 rounded-full bg-white/5 border border-white/10">
        <button
          v-for="s in SYSTEMS"
          :key="s.id"
          class="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium transition-colors duration-300"
          :class="active === s.id ? 'bg-brand text-black' : 'text-white/60 hover:text-white'"
          @click="show(s.id)"
        >
          <img :src="s.icon" class="w-3.5 h-3.5 transition-[filter] duration-300" :class="{ 'brightness-0': active === s.id }" alt="" />
          {{ s.label }}
        </button>
      </div>
    </div>

    <div class="relative flex-1 min-h-0">
      <!-- ───────── Windows 11: File Explorer with the preview pane ───────── -->
      <div
        ref="winEl"
        class="os-window absolute w-full sm:w-[90%] aspect-[4/3] sm:aspect-[16/10] flex flex-col rounded-lg overflow-hidden border border-white/10 bg-[#202020] text-[0.625rem] text-white/80 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
        :class="slot('win')"
        @click="show('win')"
      >
        <!-- Tab strip + caption buttons -->
        <div class="flex items-end h-7 pl-2 bg-[#1c1c1c] shrink-0">
          <div class="flex items-center gap-1.5 h-6 px-2.5 rounded-t-md bg-[#2b2b2b]">
            <Folder class="w-3 h-3 text-[#f5c542] fill-[#f5c542]" />
            <span>Models</span>
            <X class="w-2.5 h-2.5 ml-3 text-white/50" />
          </div>
          <Plus class="w-3 h-3 mx-2 mb-1.5 text-white/50" />
          <div class="ml-auto flex self-stretch text-white/70">
            <span class="w-8 flex items-center justify-center"><Minus class="w-3 h-3" /></span>
            <span class="w-8 flex items-center justify-center"><Square class="w-2.5 h-2.5" /></span>
            <span class="w-8 flex items-center justify-center"><X class="w-3 h-3" /></span>
          </div>
        </div>
        <!-- Address bar -->
        <div class="flex items-center gap-2 h-7 px-2.5 bg-[#2b2b2b] border-b border-black/40 shrink-0 text-white/60">
          <ChevronLeft class="w-3 h-3" />
          <ChevronRight class="w-3 h-3 text-white/25" />
          <ArrowUp class="w-3 h-3" />
          <div class="flex-1 flex items-center gap-1 h-5 px-2 rounded bg-[#1f1f1f] text-white/75 truncate">
            Downloads <ChevronRight class="w-2.5 h-2.5 text-white/40" /> Models
          </div>
          <div class="hidden sm:flex items-center gap-1 w-24 h-5 px-2 rounded bg-[#1f1f1f] text-white/35">
            <Search class="w-2.5 h-2.5" /> Search
          </div>
        </div>

        <div class="flex flex-1 min-h-0">
          <!-- Navigation pane -->
          <ul class="hidden sm:block w-[19%] shrink-0 py-1.5 border-r border-black/40 text-white/65">
            <li
              v-for="item in WIN_NAV"
              :key="item.label"
              class="flex items-center gap-1.5 mx-1 px-1.5 py-[0.1875rem] rounded"
              :class="{ 'bg-white/10 text-white': item.label === 'Downloads' }"
            >
              <component :is="item.icon" class="w-3 h-3 shrink-0" /> {{ item.label }}
            </li>
          </ul>

          <!-- Details list -->
          <div class="flex-1 min-w-0 py-1">
            <div class="flex px-3 pb-1 text-white/40 border-b border-white/5">
              <span class="flex-1">Name</span>
              <span class="w-14">Type</span>
            </div>
            <div
              v-for="(f, i) in FILES"
              :key="f.name"
              :ref="(el) => { if (el) winRows[i] = el as HTMLElement; }"
              class="relative flex items-center mx-1 px-2 py-[0.1875rem] rounded transition-colors duration-150"
              :class="i === winSel ? 'bg-white/[0.12]' : ''"
            >
              <span v-if="i === winSel" class="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-[#4cc2ff]"></span>
              <img :src="f.icon" class="w-3.5 h-3.5 mr-1.5 shrink-0" alt="" />
              <span class="flex-1 truncate">{{ f.name }}</span>
              <span class="w-14 text-white/45">{{ f.type }}</span>
            </div>
          </div>

          <!-- Preview pane -->
          <div class="w-[40%] shrink-0 flex flex-col border-l border-black/40 bg-[#1a1a1a]">
            <div class="relative flex-1 min-h-0 m-2 rounded-md overflow-hidden bg-[radial-gradient(ellipse_at_center,#2c2c30_0%,#18181a_75%)]">
              <img
                v-if="winSel >= 0"
                :key="winSel"
                :src="FILES[winSel].still"
                class="preview-in absolute inset-0 w-full h-full object-contain p-[8%]"
                alt=""
              />
              <span v-else class="absolute inset-0 flex items-center justify-center px-3 text-center text-white/30">Select a file to preview.</span>
            </div>
            <div class="flex items-center gap-1.5 px-2.5 pb-2 text-white/50">
              <img :src="appIcon" class="w-3.5 h-3.5 rounded-sm" alt="" />
              <span class="truncate">{{ winSel >= 0 ? FILES[winSel].name : 'Tripo Orbit' }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center h-5 px-3 gap-3 bg-[#1c1c1c] border-t border-black/40 text-[0.5625rem] text-white/45 shrink-0">
          <span>{{ FILES.length }} items</span>
          <span v-if="winSel >= 0">1 item selected</span>
        </div>

        <DemoCursor v-show="active === 'win'" :x="winCursor.x" :y="winCursor.y" />
      </div>

      <!-- ───────── macOS: Finder, double-click to open in Orbit ───────── -->
      <div
        ref="macEl"
        class="os-window absolute w-full sm:w-[90%] aspect-[4/3] sm:aspect-[16/10] flex flex-col rounded-xl overflow-hidden border border-white/15 bg-[#1e1e1e] text-[0.625rem] text-white/80 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
        :class="slot('mac')"
        @click="show('mac')"
      >
        <div class="flex flex-1 min-h-0">
          <!-- Sidebar -->
          <div class="hidden sm:block w-[23%] shrink-0 bg-[#2a2a2d]/90 border-r border-black/50">
            <div class="flex gap-1.5 px-3 pt-3 pb-3">
              <span class="w-2 h-2 rounded-full bg-[#ff5f57]"></span>
              <span class="w-2 h-2 rounded-full bg-[#febc2e]"></span>
              <span class="w-2 h-2 rounded-full bg-[#28c840]"></span>
            </div>
            <p class="px-3 pb-1 text-[0.5625rem] font-semibold text-white/35">Favorites</p>
            <ul class="text-white/75">
              <li
                v-for="item in MAC_NAV"
                :key="item.label"
                class="flex items-center gap-1.5 mx-1.5 px-1.5 py-[0.1875rem] rounded-md"
                :class="{ 'bg-white/10': item.label === 'Downloads' }"
              >
                <component :is="item.icon" class="w-3 h-3 shrink-0 text-[#3b9bff]" /> {{ item.label }}
              </li>
            </ul>
          </div>

          <div class="flex-1 min-w-0 flex flex-col">
            <!-- Toolbar -->
            <div class="flex items-center gap-2 h-8 px-3 bg-[#262628] border-b border-black/50 shrink-0 text-white/55">
              <div class="flex sm:hidden gap-1.5 mr-1">
                <span class="w-2 h-2 rounded-full bg-[#ff5f57]"></span>
                <span class="w-2 h-2 rounded-full bg-[#febc2e]"></span>
                <span class="w-2 h-2 rounded-full bg-[#28c840]"></span>
              </div>
              <ChevronLeft class="w-3.5 h-3.5" />
              <ChevronRight class="w-3.5 h-3.5 text-white/25" />
              <span class="font-semibold text-white/90">Models</span>
              <LayoutGrid class="w-3 h-3 ml-auto" />
              <Search class="w-3 h-3" />
            </div>
            <!-- Icon view -->
            <div class="flex-1 grid grid-cols-3 content-start gap-x-1 gap-y-2 p-3">
              <div
                v-for="(f, i) in FILES"
                :key="f.name"
                :ref="(el) => { if (el) macItems[i] = el as HTMLElement; }"
                class="flex flex-col items-center gap-1"
              >
                <div class="relative p-1 rounded-md transition-colors duration-150" :class="{ 'bg-white/[0.12]': i === macSel }">
                  <img :src="f.icon" class="w-9 h-9 sm:w-10 sm:h-10" alt="" />
                  <template v-if="i === macSel">
                    <span v-for="c in Math.min(macClicks, 2)" :key="macClicks - c" class="click-ring absolute inset-0 m-auto w-7 h-7 rounded-full border-2 border-brand"></span>
                  </template>
                </div>
                <span class="max-w-full px-1 rounded truncate leading-tight" :class="i === macSel ? 'bg-[#0a5fd7] text-white' : ''">{{ f.name }}</span>
              </div>
            </div>
            <div class="h-5 flex items-center justify-center border-t border-black/50 text-[0.5625rem] text-white/40 shrink-0">
              {{ macSel >= 0 ? `1 of ${FILES.length} selected` : `${FILES.length} items` }}
            </div>
          </div>
        </div>

        <!-- Orbit, opened over Finder -->
        <div
          class="absolute inset-x-[8%] top-[10%] bottom-[6%] transition-[opacity,transform] origin-center"
          :class="macOpen ? 'opacity-100 scale-100 duration-[380ms] ease-[cubic-bezier(0.2,0.9,0.3,1.12)]' : 'opacity-0 scale-50 duration-200 ease-in pointer-events-none'"
        >
          <OrbitWindow v-if="macSel >= 0" :title="`Tripo Orbit - ${FILES[macSel].name}`" class="h-full">
            <img
              :key="macSel"
              :src="FILES[macSel].still"
              class="absolute inset-0 w-full h-full object-contain p-[6%]"
              alt=""
            />
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
              </div>
            </template>
          </OrbitWindow>
        </div>

        <DemoCursor v-show="active === 'mac'" :x="macCursor.x" :y="macCursor.y" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.os-window {
  transition: left 0.55s cubic-bezier(0.3, 0.9, 0.3, 1), top 0.55s cubic-bezier(0.3, 0.9, 0.3, 1), opacity 0.45s ease, scale 0.55s cubic-bezier(0.3, 0.9, 0.3, 1);
}

@keyframes preview-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.preview-in {
  animation: preview-in 0.25s ease-out both;
}

@keyframes click-ring {
  from { transform: scale(0.6); opacity: 1; }
  to { transform: scale(2.2); opacity: 0; }
}
.click-ring {
  animation: click-ring 0.5s ease-out forwards;
}
</style>
