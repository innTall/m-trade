<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrdersBlockStore } from '@/stores/ordersBlock.js';

const { blocks } = storeToRefs(useOrdersBlockStore());
const { removeBlock } = useOrdersBlockStore();
const handleRemoveBlock = (blockId) => {
	removeBlock(blockId);
};
</script>

<template>
	<div class="max-h-24 overflow-y-auto text-sm pt-2 border-b border-green-600">
		<div v-for="(block, index) in blocks" :key="block.id" :id="'block-' + block.id" class="">
			<div class="flex justify-between pb-1 border-b">
				<input :id="'symbol-' + block.id" type="text" v-model="block.symbol" placeholder="Symbol"
					class="w-[8ch] text-center font-bold bg-gray-900 border uppercase" />
				<button @click="handleRemoveBlock(block.id)" class="px-2 font-bold text-red-600 border border-red-600">
					X
				</button>
			</div>
			<div class="">
				MarginOrder
			</div>
		</div>
	</div>
</template>
<style scoped></style>