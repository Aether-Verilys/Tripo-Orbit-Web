<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { vSpotlight } from '../directives/spotlight';
import { vReveal } from '../directives/reveal';
import PerfDemo from './demos/PerfDemo.vue';
import FormatsDemo from './demos/FormatsDemo.vue';
import PlatformDemo from './demos/PlatformDemo.vue';
import AigcDemo from './demos/AigcDemo.vue';

const { t, te } = useI18n();

// Each feature pairs its copy with a live demo in a landscape panel; `flip` puts the demo on the left on desktop
const features = [
  { key: 'perf', demo: PerfDemo, flip: false },
  { key: 'compat', demo: FormatsDemo, flip: true },
  { key: 'platform', demo: PlatformDemo, flip: false },
  // AIGC workflow: hidden for now, kept ready to switch back on
  { key: 'api', demo: AigcDemo, flip: true, hidden: true },
].filter((f) => !f.hidden);
</script>

<template>
  <section class="py-24 relative z-10 text-white">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Section Header -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="mb-12 text-center"
      >
        <h2 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{{ t('features.heading') }}</h2>
        <p class="text-white/50 text-xl max-w-2xl mx-auto">{{ t('features.subheading') }}</p>
      </div>

      <div
        v-for="f in features"
        :key="f.key"
        class="lg:min-h-[75vh] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-12 py-16"
      >
        <!-- Copy -->
        <div
          v-reveal
          class="reveal-left w-full lg:w-5/12 flex flex-col justify-center text-center lg:text-left"
          :class="{ 'lg:order-2': f.flip }"
        >
          <div class="inline-flex items-center justify-center lg:justify-start gap-2 text-brand font-mono text-sm mb-6 uppercase tracking-widest">
            <span class="reveal-rule w-8 h-px bg-brand"></span>
            {{ t(`features.${f.key}.tag`) }}
          </div>
          <h3 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{{ t(`features.${f.key}.title`) }}</h3>
          <p class="text-white/60 leading-relaxed text-lg md:text-2xl font-light">{{ t(`features.${f.key}.desc`) }}</p>
        </div>

        <!-- Live demo -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visible="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
          v-spotlight
          class="w-full lg:w-7/12 h-[min(35rem,85vh)] sm:h-auto sm:aspect-[4/3] rounded-[2rem] border border-white/10 bg-[#0c0c0c]/85 shadow-2xl overflow-hidden relative flex flex-col hover:border-brand/30 transition-colors duration-500"
          :class="{ 'lg:order-1': f.flip }"
        >
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,207,0,0.06)_0%,transparent_70%)] pointer-events-none"></div>
          <div class="relative flex-1 min-h-0 p-4 md:p-6">
            <component :is="f.demo" />
          </div>
          <p
            v-if="te(`features.${f.key}.note`)"
            class="relative shrink-0 px-6 pb-6 md:pb-8 text-center text-xs md:text-sm leading-relaxed text-white/45"
          >
            {{ t(`features.${f.key}.note`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
