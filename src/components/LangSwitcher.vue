<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Globe } from 'lucide-vue-next';

const { locale } = useI18n();
const open = ref(false);

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ru', label: 'Русский' },
];

const currentLabel = () => languages.find(l => l.code === locale.value)?.label || 'English';

const switchLang = (code: string) => {
  locale.value = code;
  localStorage.setItem('locale', code);
  open.value = false;
};
</script>

<template>
  <div class="relative">
    <button
      @click="open = !open"
      class="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/10"
    >
      <Globe class="w-4 h-4" />
      <span class="hidden sm:inline">{{ currentLabel() }}</span>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute right-0 top-full mt-2 w-36 rounded-xl glass-panel border border-white/10 shadow-xl overflow-hidden z-50"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="switchLang(lang.code)"
          class="w-full px-4 py-2.5 text-left text-sm transition-colors duration-150"
          :class="locale === lang.code ? 'text-brand bg-brand/10' : 'text-white/70 hover:text-white hover:bg-white/5'"
        >
          {{ lang.label }}
        </button>
      </div>
    </Transition>

    <div v-if="open" class="fixed inset-0 z-40" @click="open = false"></div>
  </div>
</template>
