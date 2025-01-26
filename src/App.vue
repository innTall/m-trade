<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import HeaderBar from './components/HeaderBar.vue';
import { useSymbolStore } from './stores/symbolStore';

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
    <header class="w-full">
      <HeaderBar />
    </header>
    <main class="overflow-hidden">
      <RouterView />
    </main>
  </div>
</template>
<style scoped></style>
