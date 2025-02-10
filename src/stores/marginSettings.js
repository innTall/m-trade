import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMarginSettingsStore = defineStore(
  'marginSettings',
  () => {
    const leverage = ref(10);
    const coefRisk = ref(2);
    const coefSL = ref(1);
    const coefExtra = ref(0.1); // Little extra on top like cherry on cake. To cover fees.
    const gridSize = ref(1);
    const gridStep = ref(1);

    return {
      leverage,
      coefRisk,
      coefSL,
      coefExtra,
      gridSize,
      gridStep,
    };
  },
  { persist: true }
);
