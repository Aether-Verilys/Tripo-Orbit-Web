<script setup lang="ts">
// Decorative model stills scattered down both sides of the hero. Each load shuffles which models appear
// and gives each one a random tilt, size and nudge within its slot, so the layout never quite repeats.
const stills = Object.values(import.meta.glob<string>('../assets/models/*.webp', { eager: true, import: 'default' }));

// Slot anchors as a share of the first screen; the side columns stay clear of the centred copy
const SLOTS = [
  { side: 'left', x: 4, y: 12 },
  { side: 'left', x: 11, y: 40 },
  { side: 'left', x: 3, y: 66 },
  { side: 'right', x: 5, y: 10 },
  { side: 'right', x: 2, y: 38 },
  { side: 'right', x: 10, y: 64 },
] as const;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const shuffled = [...stills].sort(() => Math.random() - 0.5);

const items = SLOTS.map((slot, i) => ({
  src: shuffled[i % shuffled.length],
  style: {
    [slot.side]: `${slot.x + rand(-1.5, 1.5)}%`,
    top: `${slot.y + rand(-3, 3)}%`,
    width: `${rand(9, 13).toFixed(2)}rem`,
    '--tilt': `${(rand(6, 16) * (Math.random() < 0.5 ? -1 : 1)).toFixed(1)}deg`,
    '--o': rand(0.22, 0.4).toFixed(2),
    '--delay': `${(0.6 + i * 0.12 + rand(0, 0.2)).toFixed(2)}s`,
    '--float': `${rand(6, 9).toFixed(1)}s`,
  },
}));
</script>

<template>
  <div aria-hidden="true" class="absolute inset-x-0 top-0 h-screen pointer-events-none select-none hidden lg:block">
    <div v-for="(item, i) in items" :key="i" class="hero-model absolute" :style="item.style">
      <img :src="item.src" class="hero-model-img w-full h-auto" alt="" draggable="false" />
    </div>
  </div>
</template>

<style scoped>
@keyframes hero-model-in {
  from { opacity: 0; transform: rotate(var(--tilt)) translateY(24px) scale(0.92); }
  to { opacity: var(--o); transform: rotate(var(--tilt)); }
}
@keyframes hero-model-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Opacity and transform only, so the compositor runs both animations without repainting */
.hero-model {
  opacity: var(--o);
  transform: rotate(var(--tilt));
  animation: hero-model-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) both;
}
.hero-model-img {
  will-change: transform;
  animation: hero-model-float var(--float) ease-in-out var(--delay) infinite;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6));
}

@media (prefers-reduced-motion: reduce) {
  .hero-model { animation: none; }
  .hero-model-img { animation: none; }
}
</style>
