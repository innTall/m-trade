import { ref, computed, onMounted } from 'vue';
import { defineStore } from 'pinia';
import ByBit from '@/api/bybit'; // Adjust the import path to your `getinstrumentInfo` function

export const useInstrumentInfoStore = defineStore('instrumentInfoStore', () => {
  // State
  const instrumentInfo = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedQuoteCoin = ref('USDT'); //default
  const selectedBaseCoin = ref('BTC'); //default

  // Actions
  const fetchInstrumentInfo = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await ByBit.getInstrumentsInfo();
      if (result) {
        instrumentInfo.value = result.filter(
          ({ contractType, isPreListing }) => {
            return contractType === 'LinearPerpetual' && !isPreListing;
          }
        );
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

  const selectBaseCoin = baseCoin => {
    selectedBaseCoin.value = baseCoin;
  };

  // Computed Getters
  const baseCoinList = computed(() => {
    return instrumentInfo.value
      .filter(({ quoteCoin }) => {
        return quoteCoin === selectedQuoteCoin.value;
      })
      .map(({ baseCoin }) => baseCoin);
  });

  const selectedSymbol = computed(() => {
    return `${selectedBaseCoin.value}${selectedQuoteCoin.value}`;
  });

  const selectedInstrument = computed(() => {
    return instrumentInfo.value.find(({ symbol }) => {
      return symbol === selectedSymbol.value;
    });
  });

  onMounted(async () => {
    await fetchInstrumentInfo();
  });

  return {
    instrumentInfo,
    loading,
    error,
    baseCoinList,
    selectedBaseCoin,
    selectedQuoteCoin,
    selectedInstrument,
    selectedSymbol,
    fetchInstrumentInfo,
    selectBaseCoin,
  };
});
