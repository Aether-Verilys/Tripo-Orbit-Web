<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Box, Rotate3D, ChevronDown } from 'lucide-vue-next';
import macIcon from '../assets/mac.webp';
import winIcon from '../assets/windows.webp';

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
        <span>Next-Gen 3D Viewing Engine</span>
      </div>

      <!-- Title -->
      <h1
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200, ease: 'easeOut' } }"
        class="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
      >
        Explore the 3D Universe,<br />
        <span class="text-brand glow-text">Rendered in Milliseconds</span>
      </h1>

      <!-- Subtitle -->
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 400, ease: 'easeOut' } }"
        class="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
      >
        Tripo Orbit is built for ultimate performance. Simple, pure, unleashing limitless creativity.<br/>Full format support, native optimization on both platforms, delivering an unprecedented smooth experience.
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
          <span>Download for Mac</span>
        </a>
        <a href="https://tripo-public.tripo3d.ai/plugins/tripo-orbit/tripo-orbit-win-latest.exe" class="w-full sm:w-auto flex items-center justify-center gap-3 glass-panel text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:!shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all duration-300">
          <img :src="winIcon" class="w-5 h-5" alt="Windows" />
          <span>Download for Windows</span>
        </a>
      </div>
    </div>

    <!-- Interactive Parallax Viewer -->
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
        class="relative w-full aspect-video glass-panel rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden group"
      >
        <!-- Grid Background -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div style="transform: translateZ(80px)" class="relative z-10">
          <div class="relative">
            <div class="hero-cube-spin">
              <Box class="w-32 h-32 text-brand opacity-80 drop-shadow-[0_0_40px_rgba(249,207,0,0.4)]" :stroke-width="0.5" />
            </div>
            <div class="absolute inset-0 bg-brand/20 blur-[100px] rounded-full pointer-events-none"></div>
          </div>
        </div>

        <!-- HUD Elements -->
        <div style="transform: translateZ(40px)" class="absolute top-6 left-6 text-xs font-mono text-white/40 space-y-1">
          <p>VIEWPORT // PRIMARY</p>
          <p class="text-brand">RENDER // ACTIVE</p>
        </div>

        <div style="transform: translateZ(40px)" class="absolute bottom-6 left-6 flex items-center gap-8 text-xs font-mono text-white/50">
          <div class="flex flex-col">
            <span class="text-white/30">VERTICES</span>
            <span class="text-white">1,245,031</span>
          </div>
          <div class="flex flex-col">
            <span class="text-white/30">FACES</span>
            <span class="text-white">2,490,012</span>
          </div>
          <div class="flex flex-col">
            <span class="text-white/30">FPS</span>
            <span class="text-brand font-bold text-lg glow-text">144</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { delay: 1500, duration: 1000 } }"
      class="absolute bottom-8 flex flex-col items-center gap-2 text-white/30 animate-bounce"
    >
      <span class="text-[10px] tracking-widest uppercase">Scroll to explore</span>
      <ChevronDown class="w-4 h-4" />
    </div>
  </section>
</template>

<style scoped>
@keyframes cube-spin {
  from { transform: rotateY(0deg) rotateX(0deg); }
  to { transform: rotateY(360deg) rotateX(360deg); }
}
.hero-cube-spin {
  animation: cube-spin 24s linear infinite;
}
</style>
