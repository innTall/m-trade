<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSymbolStore } from '@/stores/symbolStore';
import ByBit from '@/api/bybit';

const symbolStore = useSymbolStore();
const { selectedSymbol } = storeToRefs(symbolStore);
const orders = ref([]);

// Watchers for symbol and interval changes
watch(selectedSymbol, async newSymbol => {
  const result = await ByBit.getOrderHistory({ symbol: newSymbol.symbol });
  if (!result) return;
  orders.value = result;
});
</script>

<template>
  <div v-for="order in orders" class="h-full overflow-y-auto">
    <div>{{ order }}</div>
  </div>
</template>
