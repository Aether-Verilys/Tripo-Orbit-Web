<script setup lang="ts">
import { CircleDot, File, Info, MessageSquare, Settings, Sun } from 'lucide-vue-next';

// A scaled-down replica of the Orbit desktop UI: title bar, icon rail, viewport and optional side panel.
defineProps<{ title: string }>();
</script>

<template>
  <div translate="no" class="orbit-window notranslate flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#161618] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] text-[0.625rem] text-white/70 select-none">
    <!-- Title bar -->
    <div class="relative flex items-center h-6 px-2.5 bg-[#1f1f22] border-b border-white/5 shrink-0">
      <div class="flex gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#ff5f57]"></span>
        <span class="w-2 h-2 rounded-full bg-[#febc2e]"></span>
        <span class="w-2 h-2 rounded-full bg-[#28c840]"></span>
      </div>
      <span class="absolute inset-x-12 text-center truncate text-white/45 font-medium">{{ title }}</span>
    </div>

    <div class="flex flex-1 min-h-0">
      <!-- Icon rail -->
      <div class="w-7 shrink-0 flex flex-col items-center justify-between py-2 bg-[#111113] text-white/50">
        <div class="flex flex-col gap-2.5">
          <File class="w-3 h-3" />
          <!-- Panel toggle, side panel open -->
          <svg viewBox="0 0 24 24" class="w-3 h-3 text-white/90" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M14 3h4a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-4z" fill="currentColor" />
          </svg>
          <!-- Scene / mesh -->
          <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 5.5 22 18.5H8z" />
            <path d="M4 9h3M2.5 13.5h3M2 18h2" />
          </svg>
        </div>
        <div class="flex flex-col gap-2.5">
          <!-- Blender bridge -->
          <svg viewBox="0 0 24 24" class="w-3 h-3" fill="currentColor">
            <path d="M14.5 7.5a7 6.5 0 1 1-6.6 8.9L2.6 20.2a1 1 0 0 1-1.2-1.6l6.4-4.8L3 10.4a1 1 0 0 1 1.2-1.6l3.3 2.4V9.5H7a1 1 0 0 1 0-2h7.5zm.2 3a3.4 3 0 1 0 0 6 3.4 3 0 0 0 0-6z" />
          </svg>
          <Settings class="w-3 h-3" />
          <MessageSquare class="w-3 h-3" />
        </div>
      </div>

      <!-- Viewport -->
      <div class="relative flex-1 min-w-0 overflow-hidden bg-[radial-gradient(ellipse_at_center,#2c2c30_0%,#18181a_75%)]">
        <slot />
      </div>

      <!-- Side panel -->
      <div v-if="$slots.panel" class="w-[34%] shrink-0 bg-[#1b1b1e] border-l border-white/5 p-2.5 overflow-hidden">
        <div class="flex items-center gap-2.5 mb-2 text-white/60">
          <Info class="w-3 h-3" />
          <CircleDot class="w-3 h-3 text-brand" />
          <Sun class="w-3 h-3" />
        </div>
        <slot name="panel" />
      </div>
    </div>

    <div v-if="$slots.status" class="h-5 shrink-0 flex items-center px-2.5 gap-2 bg-[#111113] border-t border-white/5 text-[0.5625rem] text-white/40 font-mono">
      <slot name="status" />
    </div>
  </div>
</template>
