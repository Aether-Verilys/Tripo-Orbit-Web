<script setup lang="ts">
import { Apple, Monitor, Zap } from 'lucide-vue-next';

const features = [
  {
    title: '毫秒级极速渲染',
    description: '自研超高性能渲染引擎，千万级面数模型瞬间加载，丝滑拖拽无卡顿，带来极致流畅的视觉享受。',
    tag: 'PERFORMANCE',
    type: 'performance',
  },
  {
    title: '全格式与多端无缝兼容',
    description: '原生支持 GLTF, FBX, OBJ, STL 等十余种主流 3D 格式。为 Windows 与 macOS 深度定制优化，随时随地提供一致的极致体验。',
    tag: 'COMPATIBILITY',
    type: 'compatibility',
  },
  {
    title: '可调 API 动态生成模型',
    description: '内置大模型 API 接口支持，可通过文字指令一键动态生成 3D 资产，无缝衔接至渲染管线，拓展创意边界。',
    tag: 'AI GENERATION',
    type: 'api',
  },
];

const formats = ['OBJ', 'FBX', 'GLTF', 'STL', 'USDZ'];
</script>

<template>
  <section class="py-24 relative z-10 text-white">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Section Header -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="mb-24 text-center"
      >
        <h2 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">重塑 3D 交互范式</h2>
        <p class="text-white/50 text-xl max-w-2xl mx-auto">强大的底层性能与优雅的极简设计交织，让每一次模型探视都成为沉浸式的视觉享受。</p>
      </div>

      <div class="space-y-0">
        <!-- Feature 1: Performance -->
        <div class="min-h-[80vh] md:min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 py-16">
          <div
            v-motion
            :initial="{ opacity: 0, x: -50 }"
            :visible-once="{ opacity: 1, x: 0, transition: { duration: 600 } }"
            class="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left"
          >
            <div class="inline-flex items-center justify-center md:justify-start gap-2 text-brand font-mono text-sm mb-6 uppercase tracking-widest">
              <span class="w-8 h-px bg-brand"></span>
              PERFORMANCE
            </div>
            <h3 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">毫秒级极速渲染</h3>
            <p class="text-white/60 leading-relaxed text-lg md:text-2xl font-light">自研超高性能渲染引擎，千万级面数模型瞬间加载，丝滑拖拽无卡顿，带来极致流畅的视觉享受。</p>
          </div>
          <div
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :visible-once="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
            class="w-full md:w-1/2 h-[50vh] md:h-[70vh] rounded-[2rem] md:rounded-[3rem] glass-panel border border-white/10 flex items-center justify-center bg-black/50 shadow-2xl overflow-hidden relative"
          >
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,207,0,0.05)_0%,transparent_70%)]"></div>
            <div class="relative w-full h-full flex items-center justify-center">
              <div class="perf-ring-outer w-48 h-48 md:w-64 md:h-64 rounded-full border border-brand/30 border-t-brand border-r-transparent flex items-center justify-center">
                <div class="perf-ring-inner w-32 h-32 md:w-48 md:h-48 rounded-full border border-brand/20 border-b-brand border-l-transparent"></div>
              </div>
              <div class="absolute text-5xl md:text-7xl font-display font-bold text-white italic tracking-tighter">
                2<span class="text-3xl md:text-4xl text-brand">ms</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature 2: Compatibility -->
        <div class="min-h-[80vh] md:min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 py-16">
          <div
            v-motion
            :initial="{ opacity: 0, x: 50 }"
            :visible-once="{ opacity: 1, x: 0, transition: { duration: 600 } }"
            class="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left md:order-2"
          >
            <div class="inline-flex items-center justify-center md:justify-start gap-2 text-brand font-mono text-sm mb-6 uppercase tracking-widest">
              <span class="w-8 h-px bg-brand"></span>
              COMPATIBILITY
            </div>
            <h3 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">全格式与多端无缝兼容</h3>
            <p class="text-white/60 leading-relaxed text-lg md:text-2xl font-light">原生支持 GLTF, FBX, OBJ, STL 等十余种主流 3D 格式。为 Windows 与 macOS 深度定制优化，随时随地提供一致的极致体验。</p>
          </div>
          <div
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :visible-once="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
            class="w-full md:w-1/2 h-[50vh] md:h-[70vh] rounded-[2rem] md:rounded-[3rem] glass-panel border border-white/10 flex items-center justify-center bg-black/50 shadow-2xl overflow-hidden relative md:order-1"
          >
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,207,0,0.05)_0%,transparent_70%)]"></div>
            <div class="flex flex-col items-center justify-center gap-10 w-full px-6">
              <div class="flex flex-wrap items-center justify-center gap-3">
                <div
                  v-for="(f, i) in formats"
                  :key="f"
                  v-motion
                  :initial="{ opacity: 0, scale: 0.8 }"
                  :visible-once="{ opacity: 1, scale: 1, transition: { delay: i * 100 } }"
                  class="px-5 py-2.5 rounded-xl glass-panel text-lg font-mono text-white/80 border border-white/20"
                >
                  {{ f }}
                </div>
              </div>
              <div class="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div class="flex items-center gap-10 text-white/30">
                <div class="compat-float-a">
                  <Apple class="w-12 h-12 text-white/80" />
                </div>
                <div class="compat-float-b">
                  <Monitor class="w-12 h-12 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature 3: API -->
        <div class="min-h-[80vh] md:min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 py-16">
          <div
            v-motion
            :initial="{ opacity: 0, x: -50 }"
            :visible-once="{ opacity: 1, x: 0, transition: { duration: 600 } }"
            class="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left"
          >
            <div class="inline-flex items-center justify-center md:justify-start gap-2 text-brand font-mono text-sm mb-6 uppercase tracking-widest">
              <span class="w-8 h-px bg-brand"></span>
              AI GENERATION
            </div>
            <h3 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">可调 API 动态生成模型</h3>
            <p class="text-white/60 leading-relaxed text-lg md:text-2xl font-light">内置大模型 API 接口支持，可通过文字指令一键动态生成 3D 资产，无缝衔接至渲染管线，拓展创意边界。</p>
          </div>
          <div
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :visible-once="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
            class="w-full md:w-1/2 h-[50vh] md:h-[70vh] rounded-[2rem] md:rounded-[3rem] glass-panel border border-white/10 flex items-center justify-center bg-black/50 shadow-2xl overflow-hidden relative"
          >
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,207,0,0.05)_0%,transparent_70%)]"></div>
            <div class="w-full max-w-sm mx-auto flex flex-col p-6 glass-panel rounded-2xl border border-white/10 shadow-2xl bg-black/40">
              <div class="flex gap-2 items-center border-b border-white/10 pb-4 mb-4">
                <div class="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                <span class="text-[10px] font-mono text-white/30 ml-2 tracking-widest">tripo_api.json</span>
              </div>
              <div class="font-mono text-sm text-white/60 space-y-1.5">
                <p><span class="text-brand">POST</span> /v1/models/generate</p>
                <p class="text-white/30">{</p>
                <p class="pl-4">"prompt": <span class="text-green-400/80">"futuristic spaceship"</span>,</p>
                <p class="pl-4">"format": <span class="text-green-400/80">"glb"</span></p>
                <p class="text-white/30">}</p>
              </div>
              <div class="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-brand text-xs font-mono uppercase tracking-widest api-pulse">
                <Zap class="w-3.5 h-3.5" />
                Generating 3D mesh...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes perf-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes perf-spin-reverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}
.perf-ring-outer {
  animation: perf-spin 10s linear infinite;
}
.perf-ring-inner {
  animation: perf-spin-reverse 7s linear infinite;
}

@keyframes float-a {
  0%, 100% { transform: translateY(-5px); }
  50% { transform: translateY(5px); }
}
@keyframes float-b {
  0%, 100% { transform: translateY(5px); }
  50% { transform: translateY(-5px); }
}
.compat-float-a {
  animation: float-a 4s ease-in-out infinite;
}
.compat-float-b {
  animation: float-b 4s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes pulse-opacity {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
.api-pulse {
  animation: pulse-opacity 1.5s infinite;
}
</style>
