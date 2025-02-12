import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import ByBit from '@/api/bybit'; // Adjust the import path to your `getinstrumentInfo` function

const filterInstrumentInfo = array => {
  return array.filter(({ contractType, isPreListing }) => {
    return contractType === 'LinearPerpetual' && !isPreListing;
  });
};

export const useInstrumentInfoStore = defineStore('instrumentInfoStore', () => {
  // State
  const instrumentInfo = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedQuote = ref(null);
  const selectedSymbol = ref(null);

  // Actions
  const fetchInstrumentInfo = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await ByBit.getInstrumentsInfo();
      if (result) {
        instrumentInfo.value = filterInstrumentInfo(result);
      } else {
        instrumentInfo.value = [];
        error.value = 'No instrumentInfo found.';
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch instrumentInfo.';
    } finally {
      loading.value = false;
    }
  };

  const quoteAssets = computed(() => {
    return Array.from(
      new Set(instrumentInfo.value.map(item => item.quoteCoin))
    );
  });

  // Computed Getters
  const baseAssets = computed(() => {
    return instrumentInfo.value.filter(({ quoteCoin }) => {
      return quoteCoin === selectedQuote.value;
    });
  });

  const selectQuote = quote => {
    selectedQuote.value = quote;
  };

  const selectSymbol = symbol => {
    selectedSymbol.value = symbol;
  };

  watch(
    () => quoteAssets.value,
    newValue => {
      selectedQuote.value = newValue[0];
    }
  );

  watch(
    () => baseAssets.value,
    newValue => {
      selectedSymbol.value = newValue[0];
    }
  );

  return {
    instrumentInfo,
    loading,
    error,
    baseAssets,
    selectedQuote,
    selectedSymbol,
    quoteAssets,
    fetchInstrumentInfo,
    selectQuote,
    selectSymbol,
  };
});
