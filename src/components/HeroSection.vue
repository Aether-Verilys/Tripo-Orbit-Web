<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Rotate3D, ChevronDown } from 'lucide-vue-next';
import macIcon from '../assets/mac.webp';
import winIcon from '../assets/windows.webp';
import demoVideo from '../assets/demo.mp4';

const { t } = useI18n();

const mouseX = ref(0);
const mouseY = ref(0);
const smoothX = ref(0);
const smoothY = ref(0);
let raf: number;

const onMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX / window.innerWidth - 0.5;
  mouseY.value = e.clientY / window.innerHeight - 0.5;
};

const onMouseLeave = () => {
  mouseX.value = 0;
  mouseY.value = 0;
};

const animate = () => {
  smoothX.value += (mouseX.value - smoothX.value) * 0.08;
  smoothY.value += (mouseY.value - smoothY.value) * 0.08;
  raf = requestAnimationFrame(animate);
};

onMounted(() => { raf = requestAnimationFrame(animate); });
onUnmounted(() => cancelAnimationFrame(raf));

const viewerStyle = computed(() => ({
  transform: `rotateX(${-smoothY.value * 20}deg) rotateY(${smoothX.value * 20}deg)`,
  transformStyle: 'preserve-3d' as const,
}));
</script>

<template>
  <section class="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
    <div class="text-center max-w-4xl mx-auto z-10 mt-12">
      <!-- Badge -->
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 800, ease: 'easeOut' } }"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-brand mb-8 border-brand/20 shadow-[0_0_20px_rgba(249,207,0,0.1)]"
      >
        <Rotate3D class="w-4 h-4" />
        <span>{{ t('hero.badge') }}</span>
      </div>

      <!-- Title -->
      <h1
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200, ease: 'easeOut' } }"
        class="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
      >
        {{ t('hero.title1') }}<br />
        <span class="text-brand glow-text">{{ t('hero.title2') }}</span>
      </h1>

      <!-- Subtitle -->
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 400, ease: 'easeOut' } }"
        class="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
      >
        {{ t('hero.subtitle') }}<br/>{{ t('hero.subtitle2') }}
      </p>

      <!-- Buttons -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 600, ease: 'easeOut' } }"
        class="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a href="https://tripo-public.tripo3d.ai/plugins/tripo-orbit/tripo-orbit-mac-latest.dmg" class="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand text-black px-8 py-4 rounded-full font-semibold hover:bg-[#ffe54d] hover:shadow-[0_0_30px_rgba(249,207,0,0.3)] transition-all duration-300">
          <img :src="macIcon" class="w-6 h-6 brightness-0" alt="Mac" />
          <span>{{ t('hero.downloadMac') }}</span>
        </a>
        <a href="https://tripo-public.tripo3d.ai/plugins/tripo-orbit/tripo-orbit-win-latest.exe" class="w-full sm:w-auto flex items-center justify-center gap-3 glass-panel text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:!shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all duration-300">
          <img :src="winIcon" class="w-5 h-5" alt="Windows" />
          <span>{{ t('hero.downloadWin') }}</span>
        </a>
      </div>
    </div>

    <!-- Interactive Parallax Viewer with Demo Video -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 40 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 800, ease: 'easeOut' } }"
      class="w-full max-w-5xl mx-auto mt-20 z-10 hidden md:block"
      style="perspective: 1200px"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <div
        :style="viewerStyle"
        class="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7),0_10px_30px_-5px_rgba(249,207,0,0.15)]"
      >
        <video
          :src="demoVideo"
          autoplay
          loop
          muted
          playsinline
          class="w-full h-auto block"
        />
      </div>
    </div>

    <!-- Mobile fallback (no parallax) -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 40 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 800, ease: 'easeOut' } }"
      class="w-full max-w-5xl mx-auto mt-20 z-10 md:hidden"
    >
      <div class="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7),0_10px_30px_-5px_rgba(249,207,0,0.15)]">
        <video
          :src="demoVideo"
          autoplay
          loop
          muted
          playsinline
          class="w-full h-auto block"
        />
      </div>
    </div>

    <!-- Scroll indicator -->
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { delay: 1500, duration: 1000 } }"
      class="mt-12 flex flex-col items-center gap-2 text-white/30 animate-bounce z-10"
    >
      <span class="text-[10px] tracking-widest uppercase">{{ t('hero.scroll') }}</span>
      <ChevronDown class="w-4 h-4" />
    </div>
  </section>
</template>
