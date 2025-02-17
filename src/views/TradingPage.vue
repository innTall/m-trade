<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import KlinesChart from '@/components/KlinesChart.vue';
import OrderPlacement from '@/components/OrderPlacement.vue';
import ActiveSymbols from '@/components/ActiveSymbols.vue';
import BottomMenu from '@/components/BottomMenu.vue';
import { useInstrumentInfoStore } from '../stores/instrumentInfoStore';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();

const instrumentInfoStore = useInstrumentInfoStore();
const { selectedBaseCoin } = storeToRefs(instrumentInfoStore);

watch(
  () => route.query,
  (newValue, oldValue) => {
    if (newValue.baseCoin !== oldValue.baseCoin)
      instrumentInfoStore.selectBaseCoin(route.query.baseCoin);
  }
);

watch(selectedBaseCoin, (newValue, oldValue) => {
  if (newValue !== oldValue) router.replace({ query: { baseCoin: newValue } });
});

onMounted(() => {
  instrumentInfoStore.selectBaseCoin(route.query.baseCoin);
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
