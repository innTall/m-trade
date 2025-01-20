<script setup>
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";
import { createChart } from "lightweight-charts";
import { useKlinesChartStore } from "@/stores/klinesChart.js";
const { klineData } = storeToRefs(useKlinesChartStore());
const { initializeChart } = useKlinesChartStore();
let chart;
let candlestickSeries;
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
	initializeChart();
	let timeout;
	watch(
		() => klineData.value,
		(newData) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				candlestickSeries.setData(newData);
			}, 100); // Debounce updates
		},
		{ deep: true }
	);
});
</script>
<template>
	<div class="flex items-center justify-center">
		<div id="chart" class="w-full h-96"></div>
	</div>
</template>