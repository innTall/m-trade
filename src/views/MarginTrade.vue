<script setup>
import MarginOptions from '@/components/MarginOptions.vue';
import KlinesChart from '@/components/KlinesChart.vue';
import MarginSettings from '@/components/MarginSettings.vue';
import OrderList from '@/components/OrderList.vue';
import OrderPlacement from '@/components/OrderPlacement.vue';
</script>

<template>
  <div class="h-full overflow-y-scroll">
    <div class="flex p-2 bg-surface-800 gap-2">
      <div class="flex-grow">
        <MarginOptions />
      </div>
      <div class="flex-shrink">
        <MarginSettings />
      </div>
    </div>
    <KlinesChart />
    <OrderList />
    <OrderPlacement />
  </div>
</template>
<style scoped></style>
