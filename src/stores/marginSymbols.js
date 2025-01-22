import { defineStore, storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useOrdersBlockStore } from '@/stores/ordersBlock.js';

export const useMarginSymbolsStore = defineStore(
  'marginSymbols',
  () => {
    const { blocks } = storeToRefs(useOrdersBlockStore()); // Computed: List of active symbols
    const selectedSymbolId = ref(null); // Track the currently selected symbol
    // Computed list of symbols sorted alphabetically
    const symbols = computed(() => {
      const allSymbols = blocks.value.map((block) => ({
        id: block.id,
        symbol: block.symbol || 'empty', // Explicitly treat empty symbols as "empty"
      }));

      // Add an explicit "empty" symbol at the beginning
      const emptySymbol = { id: null, symbol: 'empty' }; // `id: null` for the explicit empty link
      const nonEmptySymbols = allSymbols
        .filter((item) => item.symbol !== 'empty') // Exclude existing empty symbols
        .sort((a, b) => a.symbol.localeCompare(b.symbol)); // Sort non-empty symbols alphabetically
      return [emptySymbol, ...nonEmptySymbols]; // Always place "empty" link first
    });

    return {
      symbols,
      selectedSymbolId,
    };
  },
  { persist: false }
);
