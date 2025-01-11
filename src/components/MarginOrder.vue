<script setup>
import { ref } from 'vue';
import { useOrdersBlockStore } from '@/stores/ordersBlock.js';
const { removeOrderFromBlock } = useOrdersBlockStore();
const props = defineProps({
	blockId: Number,
	orderId: Number,
});
const nOrder = ref(null);
const buyPrice = ref(null);
const amount = ref(null);
const buyOrder = buyPrice * amount;
const slPrice = ref(null);
const slCost = slPrice * amount;
const tpPrice = ref(null);
const tpCost = tpPrice * amount;
const selectedSwitch = ref(null);
const handleInputChange = (key, value) => {
	updateOrder(props.blockId, props.orderId, key, value);
};
const handleRemoveOrder = () => {
	removeOrderFromBlock(props.blockId, props.orderId);
};
</script>

<template>
	<div class="flex justify-between items-center py-2">
		<span>{{ nOrder }}</span>
		<input id="buyPrice" type="number" v-model="buyPrice" placeholder="BuyPrice"
			class="w-[6ch] bg-gray-900 text-center" />
		<input id="amount" type="number" v-model="amount" placeholder="Amount" class="w-[6ch] bg-gray-900 text-center" />
		<span class="">{{ buyOrder }}</span>
		<button id="removeOrder" @click="handleRemoveOrder()"
			class="flex px-2 font-bold text-red-600 border border-red-600 items-center">x</button>
	</div>
	<div class="flex justify-between items-center pb-2 border-b">
		<!-- SL Switch -->
		<div class="flex items-center">
			<input id="sl" type="radio" name="switchGroup" v-model="selectedSwitch" value="sl" class="accent-red-600" />
			<span class="">SL</span>
		</div>
		<input id="slPrice" type="number" v-model="slPrice" placeholder="SLprice" class="w-[6ch] bg-gray-900 text-center" />
		<span class="">{{ slCost }}</span>
		<!-- TP Switch -->
		<div class="flex items-center">
			<input id="tp" type="radio" name="switchGroup" v-model="selectedSwitch" value="tp" class="accent-green-600" />
			<span class="">TP</span>
		</div>
		<input id="tpPrice" type="number" v-model="tpPrice" placeholder="TPprice" class="w-[6ch] bg-gray-900 text-center" />
		<span class="">{{ tpCost }}</span>
	</div>
</template>
<style scoped></style>