import { ref, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import ByBit from '@/api/bybit';

export const usePositionInfoStore = defineStore('positionInfoStore', () => {
  const positionInfo = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  const fetchPositionInfo = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await ByBit.getPositionInfo();
      if (result) {
        positionInfo.value = result;
      } else {
        positionInfo.value = [];
        error.value = 'No position info found.';
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch position info.';
    } finally {
      loading.value = false;
    }
  };

  const openPositionsWithPnl = computed(() => {
    if (!positionInfo.value) return [];
    return positionInfo.value.map(({ symbol, unrealisedPnl }) => {
      return {
        baseCoin: symbol.split('USDT')[0],
        symbol,
        unrealisedPnl,
      };
    });
  });

  onMounted(async () => {
    await fetchPositionInfo();
    setInterval(async () => {
      await fetchPositionInfo();
    }, 30000);
  });

  return {
    positionInfo,
    openPositionsWithPnl,
    fetchPositionInfo,
  };
});
