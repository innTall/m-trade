<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import HeaderBar from './components/HeaderBar.vue';
import FooterBar from './components/FooterBar.vue';
import { useSymbolStore } from './stores/symbolsStore';

// Load initial data
const symbolStore = useSymbolStore();
const { fetchSymbols } = symbolStore;
const { symbols } = storeToRefs(symbolStore);

onMounted(async () => {
  if (!symbols.length) {
    await fetchSymbols();
  }
});
</script>

<template>
  <div class="flex flex-col h-screen">
    <header class="w-full h-14 top-0 p-2 left-0 fixed">
      <HeaderBar />
    </header>
    <main class="flex-1 mt-14 mb-10 p-2 overflow-hidden">
      <RouterView />
    </main>
    <footer class="w-full h-12 p-2 bottom-0 left-0 fixed">
      <FooterBar />
    </footer>
  </div>
</template>
<style scoped></style>
