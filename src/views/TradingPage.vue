<script setup>
import KlinesChart from '@/components/KlinesChart.vue';
import OrderPlacement from '@/components/OrderPlacement.vue';
import ActiveSymbols from '@/components/ActiveSymbols.vue';
import BottomMenu from '@/components/BottomMenu.vue';
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
