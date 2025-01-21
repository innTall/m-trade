<script setup>
import { storeToRefs } from "pinia";
import { useChartSettingsStore } from '../stores/chartSettings.js';

const { baseAsset, quoteAsset, interval, symbol } = storeToRefs(useChartSettingsStore());
</script>

<template>
	<div class="p-2 space-y-2 bg-gray-900 rounded-lg shadow">
		<div class="flex gap-5">
			<label class="block mb-1 font-medium">Base Asset</label>
			<input type="text" v-model="baseAsset" class="w-1/3 bg-gray-900 px-3 py-1 border border-gray-300 rounded-lg" />
		</div>
		<div class="flex gap-5">
			<label class="block mb-1 font-medium">Quote Asset</label>
			<input type="text" v-model="quoteAsset" class="w-1/3 bg-gray-900 px-3 py-1 border border-gray-300 rounded-lg" />
		</div>
		<div class="flex gap-5">
			<label class="block mb-1 font-medium">Interval</label>
			<select v-model="interval" class="w-1/3 bg-gray-900 px-3 py-1 border border-gray-300 rounded-lg">
				<option value="15">15 minutes</option>
				<option value="60">1 hour</option>
				<option value="240">4 hours</option>
			</select>
		</div>
		<div class="mt-2">
			<p><strong>Symbol:</strong> {{ symbol }}</p>
			<p><strong>Interval:</strong> {{ interval }} minutes</p>
		</div>
	</div>
</template>