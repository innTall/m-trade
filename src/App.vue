<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import HeaderBar from './components/HeaderBar.vue';
import { useSymbolStore } from './stores/symbolStore';
import { useAccountStore } from './stores/accountStore';
import { useSpotMarginStore } from './stores/spotMarginStore';

// Load initial data
const symbolStore = useSymbolStore();
const accountStore = useAccountStore();
const spotMarginStore = useSpotMarginStore();
const { fetchSymbols } = symbolStore;
const { fetchAccount } = accountStore;
const { fetchSpotMarginState } = spotMarginStore;
const { symbols } = storeToRefs(symbolStore);
const { account } = storeToRefs(accountStore);
const { state } = storeToRefs(spotMarginStore);

onMounted(async () => {
  if (!symbols.length) {
    await fetchSymbols();
  }

  if (!account.length) {
    await fetchAccount();
  }

  if (!state.value) {
    await fetchSpotMarginState();
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
