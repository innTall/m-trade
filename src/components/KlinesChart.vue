<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { createChart } from "lightweight-charts";
import getKlines from "@/api/bybit/getKlines.js";

const wsUrl = "wss://stream.bybit.com/v5/public/linear";
const interval = '15';
const symbol = 'BTCUSDT';

let ws;
let chart;
let candlestickSeries;

const parseKlines = ({ result }) => {
	if (result && result.list) {
		return result.list
			.map((kline) => ({
				time: Math.floor(kline[0] / 1000),
				open: parseFloat(kline[1]),
				high: parseFloat(kline[2]),
				low: parseFloat(kline[3]),
				close: parseFloat(kline[4]),
			}))
			.sort((a, b) => a.time - b.time);
	}

	return [];
}

onMounted(() => {
	chart = createChart(document.getElementById("chart"), {
		width: document.getElementById("chart").clientWidth,
		height: 400,
		layout: {
			backgroundColor: "#ffffff",
			textColor: "#000000",
		},
		grid: {
			vertLines: {
				color: "#eeeeee",
			},
			horzLines: {
				color: "#eeeeee",
			},
		},
	});

	candlestickSeries = chart.addCandlestickSeries();
})

onMounted(async () => {
	const klines = await getKlines(symbol, interval);
	candlestickSeries.setData(parseKlines(klines));
});

onMounted(() => {
	ws = new WebSocket(wsUrl);

	ws.onopen = () => {
		console.log("WebSocket connection opened.");
		const payload = {
			op: "subscribe",
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
				message.data.length > 0
			) {
				const rawData = message.data[0];
				const formattedData = {
					time: Math.floor(rawData.start / 1000),
					open: parseFloat(rawData.open),
					high: parseFloat(rawData.high),
					low: parseFloat(rawData.low),
					close: parseFloat(rawData.close),
				};
				candlestickSeries.update(formattedData);
			}
		} catch (error) {
			console.error("Failed to process WebSocket message:", error);
		}
	};

	ws.onclose = () => {
		console.log("WebSocket connection closed.");
	};

	ws.onerror = (error) => {
		console.error("WebSocket error:", error);
	};
})

onBeforeUnmount(() => {
	if (ws) {
		ws.close();
		ws.value = null;
		console.log('WebSocket disconnected');
	}
});
</script>

<template>
	<div class="flex items-center justify-center">
		<div id="chart" class="w-full h-96"></div>
	</div>
</template>