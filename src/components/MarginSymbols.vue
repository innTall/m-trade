<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useOrdersBlockStore } from "@/stores/ordersBlock.js";
import { useMarginSymbolsStore } from "@/stores/marginSymbols.js";

// Access blocks from OrdersBlock store
const { blocks } = storeToRefs(useOrdersBlockStore());
const { symbols, selectedSymbolId } = storeToRefs(useMarginSymbolsStore());
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
	<div class="flex py-1 gap-2 border-b border-green-600">
		<p>Symbols:</p>
		<ul class="flex gap-2">
			<!-- Render symbols as links -->
			<li v-for="symbol in symbols" :key="symbol.id" class="uppercase"
				:class="{ 'font-bold underline': selectedSymbolId === symbol.id }" @click="handleSymbolClick(symbol.id, symbol.symbol)">
				{{ symbol.symbol }}
			</li>
		</ul>
	</div>
</template>