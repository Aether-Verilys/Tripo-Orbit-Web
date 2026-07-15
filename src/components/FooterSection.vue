<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import appIcon from '../assets/app.webp';

const { t } = useI18n();
</script>

<template>
  <footer class="border-t border-white/10 bg-black/40 backdrop-blur-xl py-12 relative z-10">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <img :src="appIcon" class="w-8 h-8" alt="Tripo Orbit" />
        <span class="text-lg font-display font-bold tracking-widest text-white">TRIPO ORBIT</span>
      </div>
      <p class="text-white/40 text-sm text-center md:text-left">
        &copy; {{ new Date().getFullYear() }} Tripo 3D. {{ t('footer.rights') }}
      </p>
      <div class="flex gap-6">
        <a href="https://twitter.com/tripoai" target="_blank" rel="noopener noreferrer" class="text-white/40 hover:text-white text-sm transition-colors">X</a>
        <a href="https://discord.com/invite/tripoai" target="_blank" rel="noopener noreferrer" class="text-white/40 hover:text-white text-sm transition-colors">Discord</a>
        <a href="https://www.youtube.com/channel/UCUxEy0OUAdRja1OOdTNL6oQ" target="_blank" rel="noopener noreferrer" class="text-white/40 hover:text-white text-sm transition-colors">YouTube</a>
      </div>
    </div>
  </footer>
</template>
