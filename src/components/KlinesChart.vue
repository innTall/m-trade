<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { createChart, LineStyle } from 'lightweight-charts';
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

// // Function to calculate support (lowest price)
// function calculateSupport(data) {
//   return Math.min(...data.map(d => d.low));
// }

// // Function to calculate resistance (highest price)
// function calculateResistance(data) {
//   return Math.max(...data.map(d => d.high));
// }

// // Function to calculate average closing price
// function calculateAverageClose(data) {
//   const total = data.reduce((sum, d) => sum + d.close, 0);
//   return total / data.length;
// }

// // Calculate dynamic price levels
// const support = calculateSupport(parsedKlines);
// const resistance = calculateResistance(parsedKlines);
// const averageClose = calculateAverageClose(parsedKlines);

// // Add horizontal lines dynamically
// candlestickSeries.createPriceLine({
//   price: support,
//   color: 'red',
//   lineWidth: 2,
//   lineStyle: LineStyle.Dashed,
//   axisLabelVisible: true,
//   title: 'Support',
// });

// candlestickSeries.createPriceLine({
//   price: resistance,
//   color: 'green',
//   lineWidth: 2,
//   lineStyle: LineStyle.Solid,
//   axisLabelVisible: true,
//   title: 'Resistance',
// });

// candlestickSeries.createPriceLine({
//   price: averageClose,
//   color: 'blue',
//   lineWidth: 2,
//   lineStyle: LineStyle.Dotted,
//   axisLabelVisible: true,
//   title: 'Average Close',
// });

const instrumentInfoStore = useInstrumentInfoStore();
const { selectedSymbol } = storeToRefs(instrumentInfoStore);
const chartContainer = ref(0);
const chartSettings = ref(0);
const chartData = ref([]);
const averagePriceLine = ref(null);
const selectedInterval = ref('15');

const wsUrl = 'wss://stream-testnet.bybit.com/v5/public/linear';
let ws;
let chart;
let candlestickSeries;

// ----------------------------
// Chart
// ----------------------------

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

// Resize chart
watch(chartContainer, (newValue, oldValue) => {
  if (newValue.clientHeight !== oldValue.clientHeight) {
    const chartDiv = document.getElementById('chart');
    const height = newValue.clientHeight - chartSettings.value.clientHeight;
    chart.resize(chartDiv.clientWidth, height);
  }
});

// Get and parse klines. Prepare for chart
async function getKlines({ symbol, interval }) {
  // Fetch historical data for the new selection
  const klines = await ByBit.getKlines(symbol, interval);
  if (!klines) return [];

  return klines
    .map(kline => ({
      time: Math.floor(kline[0] / 1000),
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
    }))
    .sort((a, b) => a.time - b.time);
}

// Function to calculate average closing price
function calculateAverageClose(data) {
  const total = data.reduce((sum, d) => sum + d.close, 0);
  return total / data.length;
}

function addAveragePriceLine(klines) {
  if (averagePriceLine.value) {
    candlestickSeries.removePriceLine(averagePriceLine.value);
  }

  averagePriceLine.value = {
    price: calculateAverageClose(klines.slice(0, 100)),
    color: 'blue',
    lineWidth: 2,
    lineStyle: LineStyle.Dotted,
    axisLabelVisible: true,
    title: 'Average Close',
  };
  candlestickSeries.createPriceLine(averagePriceLine.value);
}

onMounted(async () => {
  if (!selectedSymbol.value) return;
  const klines = await getKlines({
    symbol: selectedSymbol.value,
    interval: selectedInterval.value,
  });
  chartData.value = klines;
  candlestickSeries.setData(klines);
  addAveragePriceLine(klines);
  initKlinesWebSocket({
    symbol: selectedSymbol.value,
    interval: selectedInterval.value,
    chart: candlestickSeries,
  });
});

// Watchers for symbol and interval changes
watch([selectedSymbol, selectedInterval], async ([newSymbol, newInterval]) => {
  const klines = await getKlines({
    symbol: newSymbol,
    interval: newInterval,
  });
  chartData.value = klines;
  candlestickSeries.setData(klines);
  addAveragePriceLine(klines);
  initKlinesWebSocket({
    symbol: selectedSymbol.value,
    interval: selectedInterval.value,
    chart: candlestickSeries,
  });
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
