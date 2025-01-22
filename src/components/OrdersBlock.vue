<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useModalRemoveStore } from '@/stores/modalRemove.js';
import { useOrdersBlockStore } from '@/stores/ordersBlock.js';

const { openDialog } = useModalRemoveStore();
const { blocks } = storeToRefs(useOrdersBlockStore());
const { removeBlock } = useOrdersBlockStore();
const handleRemoveBlock = (blockId) => {
	openDialog("Delete this block?", () => {
		removeBlock(blockId);
	});
};
</script>

<template>
	<div class="max-h-24 overflow-y-auto text-sm pt-2 border-b border-green-600">
		<div v-for="(block, index) in blocks" :key="block.id" :id="'block-' + block.id" class="">
			<div class="flex justify-between pb-1 border-b">
				<input :id="'symbol-' + block.id" type="text" v-model="block.symbol" placeholder="Symbol"
					class="w-[8ch] text-center font-bold bg-gray-900 border uppercase" autocomplete="off" />
				<button @click="handleRemoveBlock(block.id)" class="px-2 font-bold text-red-600 border border-red-600"
					:disabled="blocks.length === 1" >
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