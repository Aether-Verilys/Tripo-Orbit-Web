<script setup lang="ts">
import { useI18n } from 'vue-i18n';
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

// Helper to render stars
const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating);
};
</script>

<template>
  <section class="py-20 bg-background/50 relative z-10" id="comparison">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-bold mb-6 font-display tracking-wide">
          {{ t('comparison.title') }} <span class="text-primary z-10 relative">{{ t('comparison.titleHighlight') }}</span>
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          {{ t('comparison.subtitle') }}
        </p>
      </div>

      <div class="overflow-x-auto">
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
                class="border-b transition-colors"
                :class="viewer.highlight ? 'bg-primary/5 hover:bg-primary/10 border-primary/50' : 'border-white/5 hover:bg-white/5'">
              <td class="p-4 font-medium" :class="viewer.highlight ? 'text-primary font-bold text-lg' : 'text-gray-200'">
                <div class="flex items-center gap-2">
                  <Check v-if="viewer.highlight" class="w-4 h-4 text-primary" />
                  {{ viewer.name }}
                </div>
              </td>
              <td class="p-4">
                <div class="flex gap-1">
                  <Star v-for="(filled, i) in renderStars(viewer.speed)" :key="'speed-'+i" 
                        class="w-4 h-4" 
                        :class="filled ? (viewer.highlight ? 'text-yellow-400 fill-yellow-400' : 'text-primary fill-primary') : 'text-white/10 fill-transparent'" />
                </div>
              </td>
              <td class="p-4">
                <div class="flex gap-1">
                  <Star v-for="(filled, i) in renderStars(viewer.polygon)" :key="'polygon-'+i" 
                        class="w-4 h-4" 
                        :class="filled ? (viewer.highlight ? 'text-yellow-400 fill-yellow-400' : 'text-primary fill-primary') : 'text-white/10 fill-transparent'" />
                </div>
              </td>
              <td class="p-4">
                <div class="flex gap-1">
                  <Star v-for="(filled, i) in renderStars(viewer.ease)" :key="'ease-'+i" 
                        class="w-4 h-4" 
                        :class="filled ? (viewer.highlight ? 'text-yellow-400 fill-yellow-400' : 'text-primary fill-primary') : 'text-white/10 fill-transparent'" />
                </div>
              </td>
              <td class="p-4">
                <div class="flex gap-1">
                  <Star v-for="(filled, i) in renderStars(viewer.format)" :key="'format-'+i" 
                        class="w-4 h-4" 
                        :class="filled ? (viewer.highlight ? 'text-yellow-400 fill-yellow-400' : 'text-primary fill-primary') : 'text-white/10 fill-transparent'" />
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
