<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronDown } from 'lucide-vue-next';

const { t, tm } = useI18n();

const openSet = ref<Set<number>>(new Set());

function toggle(index: number) {
  if (openSet.value.has(index)) {
    openSet.value.delete(index);
  } else {
    openSet.value.add(index);
  }
  openSet.value = new Set(openSet.value);
}

const faqs = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
  { q: 'faq.q7', a: 'faq.a7' },
];
</script>

<template>
  <section class="py-24 md:py-32 relative z-10 px-6 border-t border-white/5">
    <div class="max-w-3xl mx-auto">
      <!-- Heading -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-16"
      >
        <h2 class="text-4xl md:text-5xl font-bold mb-4">
          {{ t('faq.title') }}
        </h2>
        <p class="text-white/50 text-lg">{{ t('faq.subtitle') }}</p>
      </div>

      <!-- FAQ items -->
      <div class="space-y-3">
        <div
          v-for="(item, index) in faqs"
          :key="index"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 60 } }"
          class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-colors hover:border-white/20"
          :class="{ 'border-[#F9CF00]/30 bg-[#F9CF00]/5': openSet.has(index) }"
        >
          <button
            class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            @click="toggle(index)"
          >
            <span class="font-semibold text-base md:text-lg leading-snug">
              <span class="text-[#F9CF00] mr-2">Q{{ index + 1 }}.</span>{{ t(item.q) }}
            </span>
            <ChevronDown
              class="shrink-0 w-5 h-5 text-white/50 transition-transform duration-300"
              :class="{ 'rotate-180 text-[#F9CF00]': openSet.has(index) }"
            />
          </button>
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="openSet.has(index)" class="px-6 pb-5">
              <p class="text-white/60 text-sm md:text-base leading-relaxed">{{ t(item.a) }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
