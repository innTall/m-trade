<script setup>
import KlinesChart from '@/components/KlinesChart.vue';
import OrderPlacement from '@/components/OrderPlacement.vue';
import ActiveSymbols from '@/components/ActiveSymbols.vue';
</script>

<template>
  <div class="flex flex-col h-screen">
    <ActiveSymbols />
    <KlinesChart />
    <OrderPlacement />
  </div>
</template>
<style scoped></style>
