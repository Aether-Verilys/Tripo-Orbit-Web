<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowUp } from 'lucide-vue-next';

const isVisible = ref(false);

const toggleVisibility = () => {
  isVisible.value = window.scrollY > 500;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => window.addEventListener('scroll', toggleVisibility));
onUnmounted(() => window.removeEventListener('scroll', toggleVisibility));
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-5 scale-80"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-5 scale-80"
  >
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white transition-all duration-300 group shadow-lg border border-white/20"
      aria-label="Back to top"
    >
      <ArrowUp class="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
    </button>
  </Transition>
</template>
