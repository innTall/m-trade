import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchKlineData } from "@/utils/fetchKlineData.js";
import { setupWebSocket } from "@/utils/webSocketBybit.js";
export const useKlinesChartStore = defineStore("klinesChart", () => {
  const baseAsset = ref("BTC");
  const quoteAsset = ref("USDT");
  const interval = ref("15");
  const klineData = ref([]); //const symbol = computed(() => `${baseAsset.value}${quoteAsset.value}`);
  let websocket = null;
  const initializeChart = async () => {
    const data = await fetchKlineData(
      baseAsset.value,
      quoteAsset.value,
      interval.value
    );
    if (data) {
      klineData.value = data;
    }
    setupWebSocketConnection();
  };
  const setupWebSocketConnection = () => {
    if (websocket) {
      websocket.close();
    }
    websocket = setupWebSocket(
      baseAsset.value,
      quoteAsset.value,
      interval.value,
      (message) => {
        const newCandle = {
          time: Math.floor(message[0].start / 1000),
          open: parseFloat(message[0].open),
          high: parseFloat(message[0].high),
          low: parseFloat(message[0].low),
          close: parseFloat(message[0].close),
        };
        updateKlineData(newCandle);
      }
    );
  };
  const updateKlineData = (newCandle) => {
    const lastCandle = klineData.value[klineData.value.length - 1];
    if (lastCandle && lastCandle.time === newCandle.time) {
      Object.assign(lastCandle, newCandle);
    } else {
      klineData.value.push(newCandle);
    } // Sort data and enforce a limit of 200 candles
    klineData.value.sort((a, b) => a.time - b.time);
    if (klineData.value.length > 200) {
      klineData.value.shift();
    }
  };
  return {
    //symbol,
    baseAsset,
    quoteAsset,
    interval,
    klineData,
    initializeChart,
    setupWebSocketConnection,
  };
});
