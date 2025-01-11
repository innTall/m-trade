import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchKlineData } from "@/utils/fetchKlineData.js";

export const useCandleChartStore = defineStore("candleChart", () => {
  const klineData = ref(null); // Store fetched Kline data
  const isLoading = ref(false); // Loading state
  const error = ref(null); // Error state

  const fetchKline = async (baseAsset) => {
    if (!baseAsset) {
      error.value = "Base asset is not specified!";
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchKlineData(baseAsset);
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
