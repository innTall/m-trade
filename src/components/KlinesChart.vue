<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { createChart } from 'lightweight-charts';
import ByBit from '@/api/bybit';
import SelectInteval from './SelectInteval.vue';
import SelectSymbol from './SelectSymbol.vue';

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

  ws.onmessage = (event) => {
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

  ws.onerror = (error) => {
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

const selectedSymbol = ref('BTCUSDT');
const selectedInterval = ref('15');

const wsUrl = 'wss://stream.bybit.com/v5/public/linear';
let ws;
let chart;
let candlestickSeries;

const parseKlines = (klines) => {
  return klines
    .map((kline) => ({
      time: Math.floor(kline[0] / 1000),
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
    }))
    .sort((a, b) => a.time - b.time);
};

onMounted(() => {
  chart = createChart(document.getElementById('chart'), {
    width: document.getElementById('chart').clientWidth,
    height: 400,
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
    symbol: selectedSymbol.value,
    interval: selectedInterval.value,
    chart: candlestickSeries,
  });
});

// Watchers for symbol and interval changes
watch([selectedSymbol, selectedInterval], async () => {
  console.log(
    `Symbol or interval changed: ${selectedSymbol.value}, ${selectedInterval.value}`
  );
  await getChartData({
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
  <div>
    <div class="flex gap-2 my-1">
      <SelectSymbol v-model="selectedSymbol" />
      <SelectInteval v-model="selectedInterval" />
    </div>
    <div id="chart" class="w-full h-96"></div>
  </div>
</template>
