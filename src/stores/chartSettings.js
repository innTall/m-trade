import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useChartSettingsStore = defineStore("chartSettings", () => {
  const baseAsset = ref("BTC"); // BTC - default value
  const quoteAsset = ref("USDT"); // USDT - default value
  const symbol = computed(
    () => `${baseAsset.value.toUpperCase()}${quoteAsset.value.toUpperCase()}`
  );
  const interval = ref(15); // 15 - default value

  return {
    baseAsset,
    quoteAsset,
    symbol,
    interval,
  };
});
