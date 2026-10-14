<script setup lang="ts">
import { File, PanelRight, Shapes, Settings, MessageSquare, Sparkles } from 'lucide-vue-next';

// A scaled-down replica of the Orbit desktop UI: title bar, icon rail, viewport and optional side panel.
defineProps<{ title: string }>();
</script>

<template>
  <div translate="no" class="orbit-window notranslate flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#161618] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] text-[10px] text-white/70 select-none">
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
          <PanelRight class="w-3 h-3 text-white/80" />
          <Shapes class="w-3 h-3" />
        </div>
        <div class="flex flex-col gap-2.5">
          <Sparkles class="w-3 h-3" />
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
        <slot name="panel" />
      </div>
    </div>

    <div v-if="$slots.status" class="h-5 shrink-0 flex items-center px-2.5 gap-2 bg-[#111113] border-t border-white/5 text-[9px] text-white/40 font-mono">
      <slot name="status" />
    </div>
  </div>
</template>
