<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useIntersectionObserver } from '@vueuse/core';
import { Check, Star, Globe, Apple } from 'lucide-vue-next';
import winIcon from '../assets/windows.webp';
import macIcon from '../assets/mac.webp';

const { t } = useI18n();

// Define the comparison data
const viewers = [
  {
    name: 'Tripo Orbit',
    speed: 5,
    polygon: 5,
    platforms: ['win', 'mac'],
    ease: 5,
    format: 5,
    highlight: true,
  },
  {
    name: 'Apple Quick Look',
    speed: 4,
    polygon: 2,
    platforms: ['mac'],
    ease: 5,
    format: 2,
    highlight: false,
  },
  {
    name: 'Windows 3D Viewer (Deprecated)',
    speed: 3,
    polygon: 2,
    platforms: ['win'],
    ease: 4,
    format: 3,
    highlight: false,
  },
  {
    name: 'Autodesk FBX Review',
    speed: 1,
    polygon: 3,
    platforms: ['win', 'mac'],
    ease: 3,
    format: 2,
    highlight: false,
  },
  {
    name: 'Babylon.js Sandbox',
    speed: 3,
    polygon: 3,
    platforms: ['web'],
    ease: 2,
    format: 3,
    highlight: false,
  },
  {
    name: 'Blender',
    speed: 4,
    polygon: 5,
    platforms: ['win', 'mac'],
    ease: 1,
    format: 5,
    highlight: false,
  }
];

const metrics = ['speed', 'polygon', 'ease', 'format'] as const;

// Helper to render stars
const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating);
};

// Rows and stars play their entrance whenever the table scrolls into view, and reset once it has fully left
const tableRef = ref<HTMLElement | null>(null);
const inView = ref(false);
useIntersectionObserver(
  tableRef,
  ([entry]) => {
    if (!entry) return;
    if (entry.intersectionRatio >= 0.15) inView.value = true;
    else if (!entry.isIntersecting) inView.value = false;
  },
  { threshold: [0, 0.15] },
);
</script>

<template>
  <section class="py-20 relative z-10" id="comparison">
    <div class="max-w-6xl mx-auto px-6">
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-16"
      >
        <h2 class="text-3xl md:text-5xl font-bold mb-6 font-display tracking-wide">
          {{ t('comparison.title') }} <span class="text-brand z-10 relative">{{ t('comparison.titleHighlight') }}</span>
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          {{ t('comparison.subtitle') }}
        </p>
      </div>

      <div ref="tableRef" class="cmp-table overflow-x-auto" :class="{ 'is-in': inView }">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="p-4 border-b border-white/10 text-gray-400 font-medium">{{ t('comparison.viewer') }}</th>
              <th class="p-4 border-b border-white/10 text-gray-400 font-medium whitespace-nowrap">{{ t('comparison.speed') }}</th>
              <th class="p-4 border-b border-white/10 text-gray-400 font-medium whitespace-nowrap">{{ t('comparison.polygon') }}</th>
              <th class="p-4 border-b border-white/10 text-gray-400 font-medium whitespace-nowrap">{{ t('comparison.ease') }}</th>
              <th class="p-4 border-b border-white/10 text-gray-400 font-medium whitespace-nowrap">{{ t('comparison.format') }}</th>
              <th class="p-4 border-b border-white/10 text-gray-400 font-medium whitespace-nowrap">{{ t('comparison.platform') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(viewer, index) in viewers" :key="index"
                class="cmp-row border-b transition-colors"
                :style="{ '--row': index }"
                :class="viewer.highlight ? 'bg-brand/5 hover:bg-brand/10 border-brand/50' : 'border-white/5 hover:bg-white/5'">
              <td class="p-4 font-medium" :class="viewer.highlight ? 'text-brand font-bold text-lg' : 'text-gray-200'">
                <div class="flex items-center gap-2">
                  <Check v-if="viewer.highlight" class="w-4 h-4 text-brand" />
                  {{ viewer.name }}
                </div>
              </td>
              <td v-for="metric in metrics" :key="metric" class="p-4">
                <div class="flex gap-1">
                  <Star v-for="(filled, i) in renderStars(viewer[metric])" :key="i"
                        class="w-4 h-4"
                        :style="{ '--star': i }"
                        :class="filled ? ['cmp-star-on', viewer.highlight ? 'text-brand fill-brand' : 'text-white/60 fill-white/60'] : 'text-white/10 fill-transparent'" />
                </div>
              </td>
              <td class="p-4">
                <div class="flex gap-2 items-center">
                  <Apple v-if="viewer.platforms.includes('mac')" class="w-5 h-5" :class="viewer.highlight ? 'text-white' : 'text-gray-400'" />
                  <img v-if="viewer.platforms.includes('win')" :src="winIcon" alt="Windows" class="w-5 h-5" :class="!viewer.highlight && 'opacity-60 grayscale'" />
                  <Globe v-if="viewer.platforms.includes('web')" class="w-5 h-5" :class="viewer.highlight ? 'text-white' : 'text-gray-400'" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes cmp-row-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}
@keyframes cmp-star-pop {
  0% { opacity: 0; transform: scale(0.3); }
  70% { opacity: 1; transform: scale(1.25); }
  100% { opacity: 1; transform: scale(1); }
}

.cmp-table:not(.is-in) .cmp-row {
  opacity: 0;
}
.cmp-table.is-in .cmp-row {
  animation: cmp-row-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--row) * 70ms);
}
.cmp-table.is-in :deep(.cmp-star-on) {
  animation: cmp-star-pop 0.4s ease-out both;
  animation-delay: calc(var(--row) * 70ms + var(--star) * 50ms + 250ms);
}
</style>
