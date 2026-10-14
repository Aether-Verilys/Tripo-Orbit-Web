<script setup lang="ts">
// Fake mouse pointer; x / y are pixels within the nearest positioned ancestor.
defineProps<{ x: number; y: number }>();
</script>

<template>
  <svg
    class="absolute w-4 h-4 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-[left,top] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] z-30"
    :style="{ left: `${x}px`, top: `${y}px` }"
    viewBox="0 0 24 24"
  >
    <path d="M4 2l16 10.5-7 1.5-3.5 7z" fill="white" stroke="black" stroke-width="1.2" stroke-linejoin="round" />
  </svg>
</template>
