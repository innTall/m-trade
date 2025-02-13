import { ref, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import ByBit from '@/api/bybit'; // Adjust the import path to your `getSymbols` function

export const useOrdersStore = defineStore('ordersStore', () => {
  const orders = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await ByBit.getOrders();
      if (result) {
        orders.value = result;
        console.log('asas', result);
      } else {
        orders.value = [];
        error.value = 'No position info found.';
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch position info.';
    } finally {
      loading.value = false;
    }
  };

  const symbolsWithOpenOrders = computed(() => {
    console.log(orders.value);
    if (!orders.value) return [];
    // Extract unique symbols where order status is open
    const symbolsObject = new Set();
    orders.value.forEach(order => {
      symbolsObject.add({
        baseAsset: order.symbol.split('USDT')[0],
        symbol: order.symbol,
      });
    });

    return Array.from(symbolsObject);
  });

  onMounted(async () => {
    await fetchOrders();
    setInterval(async () => {
      await fetchOrders();
    }, 30000);
  });

  return {
    orders,
    symbolsWithOpenOrders,
    fetchOrders,
  };
});
