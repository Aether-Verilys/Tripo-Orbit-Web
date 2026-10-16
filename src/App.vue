<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import HeroSection from './components/HeroSection.vue';
import DynamicFeatures from './components/DynamicFeatures.vue';
import ComparisonTable from './components/ComparisonTable.vue';
import DownloadCTA from './components/DownloadCTA.vue';
import FAQSection from './components/FAQSection.vue';
import FooterSection from './components/FooterSection.vue';
import ScrollToTop from './components/ScrollToTop.vue';
import ParticleBackground from './components/ParticleBackground.vue';
</script>

<template>
  <div class="min-h-screen relative font-sans text-white">
    <div class="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,207,0,0.06)_0%,transparent_60%)] pointer-events-none"></div>
    <ParticleBackground />
    <NavBar />
    <HeroSection />
    <DynamicFeatures />
    <ComparisonTable />
    <DownloadCTA />
    <FAQSection />
    <FooterSection />
    <ScrollToTop />
  </div>
</template>
