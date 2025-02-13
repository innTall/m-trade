import { ref, onMounted } from 'vue';
import { defineStore } from 'pinia';
import ByBit from '@/api/bybit'; // Adjust the import path to your `getSymbols` function

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

  onMounted(async () => {
    await fetchPositionInfo();
  });

  return {
    positionInfo,
    fetchPositionInfo,
  };
});
