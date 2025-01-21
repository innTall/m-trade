<script setup>
import { ref } from 'vue';
import { storeToRefs } from "pinia";
import { useChartSettingsStore } from '../stores/chartSettings.js';
import { fetchKlineData } from '../utils/fetchKlineData.js';
import { initializeWebSocket } from '../utils/webSocketBybit.js';
import ChartSettings from './ChartSettings.vue';

const { symbol, interval } = storeToRefs(useChartSettingsStore());
const logs = ref([]);

function fetchData() {
	fetchKlineData(symbol.value, interval.value).then((data) => {
		logs.value.push(`Fetched Data: ${JSON.stringify(data, null, 2)}`);
	});
}

function startWebSocket() {
	initializeWebSocket(symbol.value, interval.value, (update) => {
		logs.value.push(`WebSocket Update: ${JSON.stringify(update, null, 2)}`);
	});
}
</script>

<template>
	<div class="flex flex-col h-full">
		<ChartSettings />
		<div class="mt-2">
			<button @click="fetchData" class="px-4 py-1 text-white bg-blue-500 rounded-lg">Fetch Kline Data</button>
			<button @click="startWebSocket" class="px-4 py-1 ml-4 text-white bg-green-500 rounded-lg">Start
				WebSocket</button>
		</div>
		<pre class="mt-6 bg-gray-800 rounded-lg p-4">{{ logs }}</pre>
	</div>
</template>