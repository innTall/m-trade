<script setup>
import { storeToRefs } from 'pinia';
import { Button } from 'primevue';
import ByBit from '@/api/bybit';
import { useSymbolStore } from '@/stores/symbolStore';

const symbolStore = useSymbolStore();
const { selectedSymbol } = storeToRefs(symbolStore);

const sendOrder = async () => {
  await ByBit.placeOrder({
    symbol: selectedSymbol.value.symbol,
    side: 'Buy',
    amount: '0.01',
    price: '97000',
    takeProfit: '100000',
    stopLoss: '96000'
  })
}
</script>

<template>
  <div class="flex justify-between p-1 gap-2">
    <Button @click="sendOrder" label="Place Order" class="w-full" size="small" />
  </div>
</template>