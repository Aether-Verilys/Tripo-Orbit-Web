<script setup lang="ts">
import { computed } from 'vue';
import { useWindowScroll } from '@vueuse/core';
import appIcon from '../assets/app.webp';
import LangSwitcher from './LangSwitcher.vue';

const { y } = useWindowScroll();
const scrolled = computed(() => y.value > 40);
</script>

<template>
  <nav
    v-motion
    :initial="{ y: -20, opacity: 0 }"
    :enter="{ y: 0, opacity: 1, transition: { duration: 800, ease: 'easeOut' } }"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 backdrop-blur-md border-b transition-[padding,background-color,border-color] duration-300"
    :class="scrolled ? 'py-3 bg-black/60 border-white/10' : 'py-6 bg-black/10 border-white/5'"
  >
    <div class="flex items-center gap-3 group">
      <img :src="appIcon" class="w-10 h-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" alt="Tripo Orbit" />
      <div class="flex items-center gap-2">
        <span class="text-xl font-display font-bold tracking-widest text-white">TRIPO Orbit</span>
      </div>
    </div>
    <LangSwitcher />
  </nav>
</template>
