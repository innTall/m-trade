<script setup>
import MarginSettings from "./MarginSettings.vue";
import { storeToRefs } from "pinia";
import { useMarginSettingsStore } from "@/stores/marginSettings.js";
import { useMarginOptionsStore } from "@/stores/marginOptions.js";
import { useOrdersBlockStore } from "@/stores/ordersBlock.js";
const { deposit, leverage, coefRisk, coefTP, coefSL } = storeToRefs(useMarginSettingsStore());
const { margin, tpCost, slCost } = storeToRefs(useMarginOptionsStore());
const { addBlock } = useOrdersBlockStore();
</script>

<template>
	<div class="flex justify-between text-center pt-1 pb-1 border-b border-green-600">
		<div class="px-2 py-1 border rounded-md items-center hover:bg-gray-700">
			<MarginSettings />
		</div>
		<div>
			<div class="text-xs">Depo</div>
			<div class="text-sm">{{ deposit }}$</div>
		</div>
		<div>
			<div class="text-xs">Lever</div>
			<div class="text-sm">{{ leverage }}</div>
		</div>
		<div>
			<div class="text-xs">M-{{ coefRisk }}%</div>
			<div class="text-sm">{{ margin }}$</div>
		</div>
		<div>
			<div class="text-xs">TP-{{ coefTP }}%</div>
			<div class="text-sm">{{ tpCost }}$</div>
		</div>
		<div>
			<div class="text-xs">SL-{{ coefSL }}%</div>
			<div class="text-sm">{{ slCost }}$</div>
		</div>
		<button @click="addBlock" class="px-2 py-1 text-sm border rounded-lg hover:bg-gray-700">Add</button>
	</div>
</template>
<style scoped></style>