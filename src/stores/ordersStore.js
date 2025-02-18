import { ref, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import ByBit from '@/api/bybit'; // Adjust the import path to your `getSymbols` function

export const useOrdersStore = defineStore('ordersStore', () => {
  const openOrders = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  const fetchOpenOrders = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await ByBit.getOpenOrders();
      if (result) {
        openOrders.value = result;
      } else {
        openOrders.value = [];
        error.value = 'No position info found.';
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch position info.';
    } finally {
      loading.value = false;
    }
  };

  const symbolsWithOpenOrders = computed(() => {
    if (!openOrders.value) return [];
    // Extract unique symbols where order status is open
    const symbolsObject = new Set();
    openOrders.value.forEach(order => {
      symbolsObject.add({
        baseCoin: order.symbol.split('USDT')[0],
        symbol: order.symbol,
      });
    });

    return Array.from(symbolsObject);
  });

  onMounted(async () => {
    await fetchOpenOrders();
    setInterval(async () => {
      await fetchOpenOrders();
    }, 30000);
  });

  return {
    openOrders,
    symbolsWithOpenOrders,
    fetchOpenOrders,
  };
});
