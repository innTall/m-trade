<script setup>
import { storeToRefs } from 'pinia';
import { useOrdersBlockStore } from "@/stores/ordersBlock.js";
import { useMarginSymbolsStore } from "@/stores/marginSymbols.js";
const { symbols, selectedSymbolId } = storeToRefs(useMarginSymbolsStore());
const { blocks } = storeToRefs(useOrdersBlockStore());
const { scrollToBlock } = useOrdersBlockStore();
const handleSymbolClick = (symbolId, symbolName) => {
	if (symbolId === null) {
		// Handle the explicit "empty" link
		const emptyBlock = blocks.value.find((block) => block.symbol === "");
		if (emptyBlock) {
			scrollToBlock(emptyBlock.id);
			selectedSymbolId.value = emptyBlock.id; // Highlight the empty block
		}
	} else {
		// Normal symbol click
		selectedSymbolId.value = symbolId; // Update the selected symbol ID
		scrollToBlock(symbolId, symbolName); // Perform the scroll action
		//baseAsset.value = symbolName; // Update the baseAsset in the klinesBybit store
	}
};
</script>

<template>
	<!-- Block Symbols Section -->
	<div class="flex gap-2 text-sm items-center overflow-x-auto py-1 border-b border-green-600">
		<div class="">Symbols:</div>
		<div v-if="symbols.length">
			<ul class="flex gap-2">
				<!-- Link/Button for Each Symbol -->
				<li v-for="symbol in symbols" :key="symbol.id" @click="handleSymbolClick(symbol.id, symbol.symbol)"
					class="text-blue-500 cursor-pointer hover:underline uppercase transition"
					:class="selectedSymbolId === symbol.id ? 'bg-blue-500 text-white rounded px-2' : ''">
					{{ symbol.symbol }}
				</li>
			</ul>
		</div>
		<div v-else>
			<p class="text-gray-400">No symbols available.</p>
		</div>
	</div>
</template>
<style scoped></style>