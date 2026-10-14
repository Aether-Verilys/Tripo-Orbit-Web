<script setup lang="ts">
import { computed } from 'vue';
import { useWindowScroll, useWindowSize } from '@vueuse/core';

const { y } = useWindowScroll();
const { height } = useWindowSize();

const progress = computed(() => {
  const max = document.documentElement.scrollHeight - height.value;
  return max > 0 ? Math.min(1, y.value / max) : 0;
});
</script>

<template>
  <div class="fixed top-0 left-0 right-0 h-0.5 z-[60] pointer-events-none">
    <div
      class="h-full bg-brand origin-left shadow-[0_0_10px_rgba(249,207,0,0.6)]"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>
