<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePreferredReducedMotion } from '@vueuse/core';
import { Rotate3D, ChevronDown } from 'lucide-vue-next';
import macIcon from '../assets/mac.webp';
import winIcon from '../assets/windows.webp';
import demoVideo from '../assets/demo.mp4';
import demoPoster from '../assets/demo-poster.webp';
import HeroFileBridge from './HeroFileBridge.vue';
import HeroModels from './HeroModels.vue';

const { t } = useI18n();

const mouseX = ref(0);
const mouseY = ref(0);
const smoothX = ref(0);
const smoothY = ref(0);
let raf = 0;

// The loop only runs while something is still easing; mouse moves and scrolling wake it up again
const wake = () => {
  if (!raf) raf = requestAnimationFrame(animate);
};

const onMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX / window.innerWidth - 0.5;
  mouseY.value = e.clientY / window.innerHeight - 0.5;
  wake();
};

const onMouseLeave = () => {
  mouseX.value = 0;
  mouseY.value = 0;
  wake();
};

// 1 while the viewer sits at the bottom of the viewport, easing to 0 as it scrolls up into view
const viewerWrap = ref<HTMLElement | null>(null);
const scrollTilt = ref(0);
const reducedMotion = usePreferredReducedMotion();

const EPS = 0.0005;

function animate() {
  raf = 0;
  let moving = false;
  const ease = (from: number, to: number, k: number) => {
    const d = to - from;
    if (Math.abs(d) < EPS) return to;
    moving = true;
    return from + d * k;
  };

  smoothX.value = ease(smoothX.value, mouseX.value, 0.08);
  smoothY.value = ease(smoothY.value, mouseY.value, 0.08);

  const el = viewerWrap.value;
  if (el && reducedMotion.value !== 'reduce') {
    const vh = window.innerHeight;
    const target = Math.min(1, Math.max(0, (el.getBoundingClientRect().top - vh * 0.2) / (vh * 0.8)));
    scrollTilt.value = ease(scrollTilt.value, target, 0.12);
  }

  if (moving) raf = requestAnimationFrame(animate);
}

onMounted(() => {
  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('resize', wake, { passive: true });
  wake();
  // The viewer's own entrance animation moves it without a scroll, so settle the tilt again once that has played
  setTimeout(wake, 1900);
});
onUnmounted(() => {
  window.removeEventListener('scroll', wake);
  window.removeEventListener('resize', wake);
  cancelAnimationFrame(raf);
});

const viewerStyle = computed(() => ({
  transform: `rotateX(${scrollTilt.value * 14 - smoothY.value * 20}deg) rotateY(${smoothX.value * 20}deg) scale(${1 - scrollTilt.value * 0.06})`,
  transformStyle: 'preserve-3d' as const,
}));
</script>

<template>
  <section class="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
    <HeroModels />
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
        <span class="text-brand glow-text" :data-glow="t('hero.title2')">{{ t('hero.title2') }}</span>
      </h1>

      <!-- Subtitle -->
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 400, ease: 'easeOut' } }"
        class="text-lg md:text-xl text-white/60 mb-8 max-w-2xl mx-auto font-light leading-relaxed"
      >
        {{ t('hero.subtitle') }}<br/>{{ t('hero.subtitle2') }}
      </p>

      <!-- Unknown file → opened in Orbit -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 500, ease: 'easeOut' } }"
        class="mb-10"
      >
        <HeroFileBridge />
      </div>

      <!-- Buttons -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 600, ease: 'easeOut' } }"
        class="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a href="https://tripo-public.tripo3d.ai/plugins/tripo-orbit/tripo-orbit-mac-latest.dmg" class="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand text-black px-8 py-4 rounded-full font-semibold btn-shine hover:bg-[#ffe54d] hover:shadow-[0_0_30px_rgba(249,207,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300">
          <img :src="macIcon" class="w-6 h-6 brightness-0" alt="Mac" />
          <span>{{ t('hero.downloadMac') }}</span>
        </a>
        <a href="https://tripo-public.tripo3d.ai/plugins/tripo-orbit/tripo-orbit-win-latest.exe" class="w-full sm:w-auto flex items-center justify-center gap-3 glass-panel text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:!shadow-[0_0_12px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300">
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
      ref="viewerWrap"
      class="relative w-full max-w-6xl mx-auto mt-20 z-10 hidden md:block"
      style="perspective: 1200px"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <div class="hero-glow absolute -inset-x-6 -inset-y-20 -z-10 bg-[radial-gradient(ellipse_closest-side,rgba(249,207,0,0.15),rgba(249,207,0,0.06)_60%,transparent)]"></div>
      <div
        :style="viewerStyle"
        class="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7),0_10px_30px_-5px_rgba(249,207,0,0.15)]"
      >
        <video
          :src="demoVideo"
          :poster="demoPoster"
          width="1558"
          height="974"
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
      class="w-full max-w-6xl mx-auto mt-20 z-10 md:hidden"
    >
      <div class="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7),0_10px_30px_-5px_rgba(249,207,0,0.15)]">
        <video
          :src="demoVideo"
          :poster="demoPoster"
          width="1558"
          height="974"
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
      class="mt-14 flex flex-col items-center gap-3 text-white/30 animate-bounce z-10"
    >
      <span class="text-xs md:text-sm tracking-[0.3em] uppercase">{{ t('hero.scroll') }}</span>
      <ChevronDown class="w-5 h-5 md:w-6 md:h-6" />
    </div>
  </section>
</template>

<style scoped>
@keyframes hero-glow-pulse {
  0%, 100% { opacity: 0.5; transform: scale(0.96); }
  50% { opacity: 1; transform: scale(1.03); }
}
.hero-glow {
  will-change: transform, opacity;
  animation: hero-glow-pulse 6s ease-in-out infinite;
}
</style>
