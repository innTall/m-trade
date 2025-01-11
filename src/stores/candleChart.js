import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { fetchKlineData } from "@/utils/fetchKlineData.js";
import { useChartSettingsStore } from "@/stores/chartSettings.js";

export const useCandleChartStore = defineStore("candleChart", () => {
  const klineData = ref(null); // Store fetched Kline data
  const isLoading = ref(false); // Loading state
  const error = ref(null); // Error state

  const chartSettingsStore = useChartSettingsStore();
  const quoteAsset = computed(() => chartSettingsStore.quoteAsset);
  const interval = computed(() => chartSettingsStore.interval);
  const limit = computed(() => chartSettingsStore.limit);

  const fetchKline = async (baseAsset) => {
    if (!baseAsset) {
      error.value = "Base asset is not specified!";
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchKlineData(
        baseAsset,
        quoteAsset.value,
        interval.value,
        limit.value
      );
      klineData.value = data;
      console.log("Fetched Kline Data:", data);
    } catch (fetchError) {
      console.error("Error fetching Kline data:", fetchError);
      error.value = fetchError.message;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    klineData,
    isLoading,
    error,
    fetchKline,
  };
});
