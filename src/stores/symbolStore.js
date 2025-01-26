import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import ByBit from '@/api/bybit'; // Adjust the import path to your `getSymbols` function

export const useSymbolStore = defineStore('symbolStore', () => {
  // State
  const symbols = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedQuote = ref(null);
  const selectedSymbol = ref(null);

  // Actions
  const fetchSymbols = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await ByBit.getSymbols();
      if (result) {
        symbols.value = result;
      } else {
        symbols.value = [];
        error.value = 'No symbols found.';
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch symbols.';
    } finally {
      loading.value = false;
    }
  };

  const marginTradingSymbols = computed(() => {
    return symbols.value.filter(
      ({ marginTrading }) => marginTrading === 'utaOnly'
    );
  });

  const quoteAssets = computed(() => {
    return Array.from(
      new Set(marginTradingSymbols.value.map(item => item.quoteCoin))
    );
  });

  // Computed Getters
  const symbolsByQuote = computed(() => {
    return marginTradingSymbols.value.filter(({ quoteCoin }) => {
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
    () => symbolsByQuote.value,
    newValue => {
      selectedSymbol.value = newValue[0];
    }
  );

  return {
    symbols,
    loading,
    error,
    symbolsByQuote,
    selectedQuote,
    selectedSymbol,
    quoteAssets,
    fetchSymbols,
    selectQuote,
    selectSymbol,
  };
});
