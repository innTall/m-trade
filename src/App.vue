<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import HeaderBar from './components/HeaderBar.vue';
import { useInstrumentInfoStore } from './stores/instrumentInfoStore';
import { useAccountStore } from './stores/accountStore';

// Load initial data
const instrumentInfoStore = useInstrumentInfoStore();
const accountStore = useAccountStore();
const { fetchInstrumentInfo } = instrumentInfoStore;
const { fetchAccount } = accountStore;
const { instrumentInfo } = storeToRefs(instrumentInfoStore);
const { account } = storeToRefs(accountStore);

onMounted(async () => {
  if (!instrumentInfo.length) {
    await fetchInstrumentInfo();
  }

  if (!account.length) {
    await fetchAccount();
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
