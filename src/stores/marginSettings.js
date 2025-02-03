import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMarginSettingsStore = defineStore(
  'marginSettings',
  () => {
    const leverage = ref(10);
    const coefRisk = ref(2);
    const coefTP = ref(3);
    const coefSL = ref(1);
    const coefExtra = ref(0.1); // Little extra on top like cherry on cake. To cover fees.

    return {
      leverage,
      coefRisk,
      coefTP,
      coefSL,
      coefExtra,
    };
  },
  { persist: true }
);
