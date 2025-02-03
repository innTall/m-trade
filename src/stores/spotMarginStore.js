import { ref, readonly } from 'vue';
import { defineStore } from 'pinia';
import ByBit from '@/api/bybit'; // Adjust the import path to your `getSymbols` function

export const useSpotMarginStore = defineStore('spotMarginStore', () => {
  const state = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  const fetchSpotMarginState = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await ByBit.getSpotMarginState();
      if (result) {
        state.value = result;
      } else {
        state.value = null;
        error.value = 'No account found.';
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch account.';
    } finally {
      loading.value = false;
    }
  };

  return {
    state: readonly(state),
    fetchSpotMarginState,
  };
});
