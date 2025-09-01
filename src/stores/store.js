import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTradeStore = defineStore(
  'trade',
  () => {
    // --- Global inputs ---
    const a1 = ref(100); // Deposit ($)
    const a2 = ref(1); // Risk %

    // --- Long trade inputs ---
    const L_symbol = ref('BTC');
    const L4 = ref(25); // Leverage
    const L6 = ref(115500); // Buy
    const L7 = ref(112500); // SL
    const L8 = ref(119500); // TP1
    const L9 = ref(123500); // TP2

    // --- Short trade inputs ---
    const S_symbol = ref('BTC');
    const S4 = ref(25); // Leverage
    const S6 = ref(112500); // Sell
    const S7 = ref(115500); // SL
    const S8 = ref(110500); // TP1
    const S9 = ref(107500); // TP2

    // fixation settings (default 50)
    const fixTp1 = ref(50); // fix for TP1

    // ✅ Must return a single object
    return {
      a1,
      a2,
      L_symbol,
      L4,
      L6,
      L7,
      L8,
      L9,
      S_symbol,
      S4,
      S6,
      S7,
      S8,
      S9,
      fixTp1,
    };
  },
  {
    // ✅ persist config must be in defineStore options, not inside return
    persist: {
      paths: ['a1', 'a2', 'fixTp1'], // only global inputs persist
    },
  }
);
