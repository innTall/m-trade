import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";
import { useMarginSettingsStore } from "@/stores/marginSettings.js";
export const useMarginOptionsStore = defineStore(
  "marginOptions",
  () => {
    const { deposit, leverage, coefRisk, coefTP, coefSL } = storeToRefs(
      useMarginSettingsStore()
    );

    // Computed properties for calculations
    const margin = computed(() => {
      if (!deposit.value || !coefRisk.value) return "0.00";
      return +((deposit.value * coefRisk.value) / 100).toFixed(2);
    });

    const tpCost = computed(() => {
      if (!margin.value || !coefTP.value || !leverage.value) return "0.00";
      return +((margin.value * coefTP.value * leverage.value) / 100).toFixed(2);
    });

    const slCost = computed(() => {
      if (!margin.value || !coefSL.value || !leverage.value) return "0.00";
      return +((margin.value * coefSL.value * leverage.value) / 100).toFixed(2);
    });

    const infoBuyOrder = computed(() => {
      if (!leverage.value || !margin.value) return "0.00";
      return +(leverage.value * parseFloat(margin.value)).toFixed(2);
    });

    return {
      margin,
      tpCost,
      slCost,
      infoBuyOrder,
    };
  },
  { persist: false }
);
