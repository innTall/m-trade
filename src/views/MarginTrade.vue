<script setup>
import MarginOptions from '@/components/MarginOptions.vue';
import KlinesChart from '@/components/KlinesChart.vue';
import MarginSettings from '@/components/MarginSettings.vue';
import OrderList from '@/components/OrderList.vue';
import PlaceOrder from '@/components/PlaceOrder.vue';
</script>

<template>
  <div>
    <div class="flex p-2 bg-surface-800 gap-2">
      <div class="flex-grow">
        <MarginOptions />
      </div>
      <div class="flex-shrink">
        <MarginSettings />
      </div>
    </div>
    <KlinesChart />
    <PlaceOrder />
    <OrderList />
  </div>
</template>
<style scoped></style>
