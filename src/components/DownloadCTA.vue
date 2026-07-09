<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Download } from 'lucide-vue-next';

const { t } = useI18n();
const isMac = computed(() => navigator.platform.toUpperCase().includes('MAC'));

const downloadUrl = computed(() =>
  isMac.value
    ? 'https://tripo-public.tripo3d.ai/plugins/tripo-orbit/tripo-orbit-mac-latest.dmg'
    : 'https://tripo-public.tripo3d.ai/plugins/tripo-orbit/tripo-orbit-win-latest.exe'
);
</script>

<template>
  <section class="py-24 md:py-32 relative z-10 flex flex-col items-center justify-center text-center px-6 border-t border-white/5 bg-black/20">
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      class="max-w-3xl mx-auto flex flex-col items-center"
    >
      <h2 class="text-4xl md:text-5xl font-bold mb-8 tracking-tight text-white">{{ t('cta.title') }}</h2>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <a :href="downloadUrl" class="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300">
          <Download class="w-5 h-5" />
          <span>{{ t('cta.freeDownload') }}</span>
        </a>
      </div>
      <p class="mt-8 text-white/40 text-sm">{{ t('cta.betaOpen') }}</p>
    </div>
  </section>
</template>
