<script setup>
import KlinesChart from '@/components/KlinesChart.vue';
import OrderList from '@/components/OrderList.vue';
import OrderPlacement from '@/components/OrderPlacement.vue';
</script>

<template>
  <div class="h-full overflow-y-scroll">
    <KlinesChart />
    <OrderList />
    <OrderPlacement />
  </div>
</template>
<style scoped></style>
