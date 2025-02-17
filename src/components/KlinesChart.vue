<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { createChart } from 'lightweight-charts';
import ByBit from '@/api/bybit';
import SelectInteval from './SelectInteval.vue';
import SelectBaseAsset from './SelectBaseCoin.vue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';

// Function to initialize the WebSocket connection
const initKlinesWebSocket = ({ symbol, interval, chart }) => {
  if (ws) {
    ws.close();
    ws = null;
    console.log('Previous WebSocket disconnected');
  }

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connection opened.');
    const payload = {
      op: 'subscribe',
      args: [`kline.${interval}.${symbol}`],
    };
    ws.send(JSON.stringify(payload));
  };

  ws.onmessage = event => {
    try {
      const message = JSON.parse(event.data);
      if (
        message &&
        message.topic === `kline.${interval}.${symbol}` &&
        Array.isArray(message.data) &&
        message.data.length
      ) {
        const rawData = message.data[0];
        const formattedData = {
          time: Math.floor(rawData.start / 1000),
          open: parseFloat(rawData.open),
          high: parseFloat(rawData.high),
          low: parseFloat(rawData.low),
          close: parseFloat(rawData.close),
        };
        chart.update(formattedData);
      }
    } catch (error) {
      console.error('Failed to process WebSocket message:', error);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed.');
  };

  ws.onerror = error => {
    console.error('WebSocket error:', error);
  };
};

const getKlines = async ({ symbol, interval, chart }) => {
  // Fetch historical data for the new selection
  const klines = await ByBit.getKlines(symbol, interval);
  if (!klines) return;

  chart.setData(parseKlines(klines));
};

const getChartData = async ({ symbol, interval, chart }) => {
  await getKlines({ symbol, interval, chart });
  initKlinesWebSocket({ symbol, interval, chart });
};

const instrumentInfoStore = useInstrumentInfoStore();
const { selectedInstrument } = storeToRefs(instrumentInfoStore);
const chartContainer = ref(0);
const chartSettings = ref(0);

const selectedInterval = ref('15');

const wsUrl = 'wss://stream-testnet.bybit.com/v5/public/linear';
let ws;
let chart;
let candlestickSeries;

const parseKlines = klines => {
  return klines
    .map(kline => ({
      time: Math.floor(kline[0] / 1000),
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
    }))
    .sort((a, b) => a.time - b.time);
};

onMounted(() => {
  const chartDiv = document.getElementById('chart');
  chart = createChart(chartDiv, {
    width: chartDiv.clientWidth,
    height:
      chartContainer.value.clientHeight - chartSettings.value.clientHeight,
    layout: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
    },
    grid: {
      vertLines: {
        color: '#eeeeee',
      },
      horzLines: {
        color: '#eeeeee',
      },
    },
  });

  candlestickSeries = chart.addCandlestickSeries();
});

onMounted(async () => {
  await getChartData({
    symbol: selectedInstrument.symbol || 'BTCUSDT',
    interval: selectedInterval.value,
    chart: candlestickSeries,
  });
});

// Watchers for symbol and interval changes
watch(
  [selectedInstrument, selectedInterval],
  async ([newSymbol, newInterval]) => {
    console.log(
      `Symbol or interval changed: ${newSymbol.symbol}, ${newInterval}`
    );
    await getChartData({
      symbol: newSymbol.symbol || 'BTCUSDT',
      interval: newInterval,
      chart: candlestickSeries,
    });
  }
);

// Resize chart
watch(chartContainer, (newValue, oldValue) => {
  if (newValue.clientHeight !== oldValue.clientHeight) {
    const chartDiv = document.getElementById('chart');
    const height = newValue.clientHeight - chartSettings.value.clientHeight;
    chart.resize(chartDiv.clientWidth, height);
  }
});

onBeforeUnmount(() => {
  if (ws) {
    ws.close();
    ws = null;
    console.log('WebSocket disconnected');
  }
});
</script>

<template>
  <div class="h-full" ref="chartContainer">
    <div class="flex gap-2 py-1" ref="chartSettings">
      <SelectBaseAsset />
      <SelectInteval v-model="selectedInterval" />
    </div>
    <div id="chart"></div>
  </div>
</template>
