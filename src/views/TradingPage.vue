<script setup>
import { onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import KlinesChart from '@/components/KlinesChart.vue';
import OrderPlacement from '@/components/OrderPlacement.vue';
import ActiveSymbols from '@/components/ActiveSymbols.vue';
import BottomMenu from '@/components/BottomMenu.vue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();

const instrumentInfoStore = useInstrumentInfoStore();
const { selectedBaseCoin } = storeToRefs(instrumentInfoStore);

const baseCoin = computed(() => {
  return route.query.baseCoin || 'BTC';
});

watch(
  () => route.query,
  (newValue, oldValue) => {
    if (newValue.baseCoin !== oldValue.baseCoin)
      instrumentInfoStore.selectBaseCoin(baseCoin.value);
  }
);

watch(selectedBaseCoin, (newValue, oldValue) => {
  if (newValue !== oldValue) router.replace({ query: { baseCoin: newValue } });
});

onMounted(() => {
  if (baseCoin.value) return instrumentInfoStore.selectBaseCoin(baseCoin.value);
});
</script>

<template>
  <div class="flex flex-col h-screen">
    <ActiveSymbols />
    <KlinesChart />
    <OrderPlacement />
    <BottomMenu />
  </div>
</template>
<style scoped></style>
