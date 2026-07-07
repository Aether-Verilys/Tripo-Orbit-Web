<script setup lang="ts">
import { Box } from 'lucide-vue-next';
</script>

<template>
  <nav
    v-motion
    :initial="{ y: -20, opacity: 0 }"
    :enter="{ y: 0, opacity: 1, transition: { duration: 800, ease: 'easeOut' } }"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 backdrop-blur-md bg-black/10 border-b border-white/5"
  >
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center border border-brand/20">
        <Box class="w-6 h-6 text-brand" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xl font-display font-bold tracking-widest text-white">TRIPO ORBIT</span>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand text-black tracking-widest mt-0.5">BETA</span>
      </div>
    </div>
  </nav>
</template>
