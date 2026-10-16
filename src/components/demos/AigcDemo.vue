<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Sparkles, FileJson, ArrowRight } from 'lucide-vue-next';
import OrbitWindow from './OrbitWindow.vue';
import { useDemoLoop } from '../../composables/useDemoLoop';
import viewportVideo from '../../assets/viewport.mp4';
import viewportPoster from '../../assets/viewport-poster.webp';

const { t } = useI18n();

// Real output of `tripo-orbit-cli info Trinity.glb`, trimmed to the headline fields
const RAW_DATA: [string, string | number][] = [
  ['format', 'GLB'],
  ['vertices', 11456],
  ['faces', 18908],
  ['material_count', 1],
  ['texture_count', 4],
  ['animation_count', 1],
  ['skin_count', 1],
  ['node_count', 67],
  ['uv_sets', 1],
];

const stage = ref<HTMLElement | null>(null);
const video = ref<HTMLVideoElement | null>(null);

const typed = ref(0);
const phase = ref<'prompt' | 'generating' | 'done' | 'exported'>('prompt');
const progress = ref(0);
const pressed = ref<'generate' | 'export' | null>(null);
const shownLines = ref(0);

const prompt = computed(() => t('demo.aigc.prompt'));

useDemoLoop(stage, async (wait) => {
  typed.value = 0;
  phase.value = 'prompt';
  progress.value = 0;
  shownLines.value = 0;
  video.value?.pause();
  await wait(600);

  // Type the prompt, then press Generate
  while (typed.value < prompt.value.length) {
    typed.value++;
    await wait(45);
  }
  await wait(350);
  pressed.value = 'generate';
  await wait(180);
  pressed.value = null;

  phase.value = 'generating';
  video.value?.play().catch(() => {});
  while (progress.value < 100) {
    progress.value = Math.min(100, progress.value + 1.5 + Math.random() * 3);
    await wait(40);
  }
  phase.value = 'done';
  await wait(1400);

  // Export the raw data and stream it out line by line
  pressed.value = 'export';
  await wait(180);
  pressed.value = null;
  phase.value = 'exported';
  while (shownLines.value < RAW_DATA.length) {
    shownLines.value++;
    await wait(130);
  }

  await wait(4200);
});
</script>

<template>
  <div ref="stage" class="relative w-full h-full flex items-center justify-center">
    <div class="relative w-full sm:w-[76%] sm:-translate-x-[10%]">
      <OrbitWindow :title="phase === 'prompt' ? 'Tripo Orbit' : 'Tripo Orbit - Trinity.glb'" class="aspect-square sm:aspect-[4/3]">
        <!-- Ghost of the mesh while generating -->
        <video
          ref="video"
          :src="viewportVideo"
          :poster="viewportPoster"
          muted
          loop
          playsinline
          preload="auto"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          :class="phase === 'prompt' ? 'opacity-0' : 'opacity-100'"
          :style="phase === 'generating' ? { clipPath: `inset(${100 - progress}% 0 0 0)` } : undefined"
        />
        <!-- Scan line at the reveal edge -->
        <div
          v-if="phase === 'generating'"
          class="absolute inset-x-0 h-px bg-brand shadow-[0_0_12px_3px_rgba(249,207,0,0.7)]"
          :style="{ top: `${100 - progress}%` }"
        ></div>
        <div
          v-if="phase === 'generating'"
          class="absolute inset-0 bg-[linear-gradient(rgba(249,207,0,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(249,207,0,0.07)_1px,transparent_1px)] bg-[size:14px_14px]"
          :style="{ clipPath: `inset(0 0 ${progress}% 0)` }"
        ></div>

        <div
          v-if="phase === 'generating'"
          class="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 text-brand font-mono"
        >
          <Sparkles class="w-3 h-3 animate-pulse" />
          {{ t('demo.aigc.generating') }} {{ Math.floor(progress) }}%
        </div>

        <!-- Prompt bar -->
        <div
          class="absolute left-2.5 right-2.5 bottom-2.5 flex items-center gap-1.5 p-1 pl-2 rounded-lg bg-black/60 border border-white/10 backdrop-blur transition-[opacity,transform] duration-300"
          :class="phase === 'prompt' || phase === 'generating' ? 'opacity-100' : 'opacity-0 translate-y-2'"
        >
          <Sparkles class="w-3 h-3 text-brand shrink-0" />
          <span class="flex-1 min-w-0 truncate text-white/85">
            {{ prompt.slice(0, typed) }}<span v-if="phase === 'prompt'" class="caret">|</span>
          </span>
          <span
            class="shrink-0 px-2 py-0.5 rounded-md bg-brand text-black font-semibold transition-transform duration-150"
            :class="{ 'scale-90': pressed === 'generate' }"
          >{{ t('demo.aigc.generate') }}</span>
        </div>

        <template #panel>
          <div class="flex flex-col h-full">
            <p class="flex items-center gap-1 text-white/80 mb-1.5"><Sparkles class="w-3 h-3 text-brand" /> Tripo AI</p>
            <div class="grid grid-cols-2 gap-1 mb-3">
              <span class="demo-chip demo-chip-on">{{ t('demo.aigc.text') }}</span>
              <span class="demo-chip">{{ t('demo.aigc.image') }}</span>
            </div>
            <p class="text-white/80 mb-1.5">Raw Data</p>
            <span
              class="flex items-center justify-center gap-1 py-1 rounded border text-[0.5625rem] transition-all duration-200"
              :class="[
                phase === 'done' || phase === 'exported' ? 'border-brand/60 text-brand' : 'border-white/10 text-white/30',
                phase === 'done' ? 'export-glow' : '',
                pressed === 'export' ? 'scale-90 bg-brand/20' : '',
              ]"
            >
              <FileJson class="w-3 h-3" /> {{ t('demo.aigc.export') }}
            </span>
          </div>
        </template>
      </OrbitWindow>
    </div>

    <!-- Exported JSON card -->
    <div
      class="absolute right-0 bottom-[6%] w-[52%] sm:w-[40%] rounded-xl border border-white/10 bg-black/80 backdrop-blur-md p-3 font-mono text-[0.625rem] md:text-[0.6875rem] shadow-2xl transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1.1)]"
      :class="phase === 'exported' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'"
    >
      <div class="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-white/40">
        <FileJson class="w-3.5 h-3.5 text-brand" />
        Trinity.glb.raw.json
      </div>
      <p class="text-white/30">{</p>
      <p
        v-for="([key, value], i) in RAW_DATA"
        :key="key"
        class="pl-3 transition-opacity duration-200"
        :class="i < shownLines ? 'opacity-100' : 'opacity-0'"
      >
        <span class="text-white/55">"{{ key }}"</span>: <span :class="typeof value === 'number' ? 'text-brand' : 'text-green-400/80'">{{ typeof value === 'number' ? value : `"${value}"` }}</span><span class="text-white/30">{{ i < RAW_DATA.length - 1 ? ',' : '' }}</span>
      </p>
      <p class="text-white/30">}</p>
      <div
        class="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-brand transition-opacity duration-300"
        :class="shownLines === RAW_DATA.length ? 'opacity-100' : 'opacity-0'"
      >
        {{ t('demo.aigc.toAi') }} <ArrowRight class="w-3 h-3 send-nudge" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes caret-blink {
  50% { opacity: 0; }
}
.caret {
  margin-left: 1px;
  color: var(--color-brand);
  animation: caret-blink 0.9s step-end infinite;
}

@keyframes export-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(249, 207, 0, 0); }
  50% { box-shadow: 0 0 10px 1px rgba(249, 207, 0, 0.45); }
}
.export-glow {
  animation: export-glow 1s ease-in-out infinite;
}

@keyframes send-nudge {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}
.send-nudge {
  animation: send-nudge 1s ease-in-out infinite;
}
</style>
