<script setup>
import { ref, computed, watch } from 'vue';
import { useOrdersBlockStore } from '@/stores/ordersBlock.js';
const { removeOrderFromBlock, updateOrder } = useOrdersBlockStore();
// Props for block and order identification
const props = defineProps({
	blockId: Number,
	orderId: Number,
});
// Reactive data for input fields
const buyPrice = ref(null);
const amount = ref(null);
const slPrice = ref(null);
const tpPrice = ref(null);
const selectedSwitch = ref(null);
// Computed properties for calculated values
const buyOrder = computed(() => (buyPrice.value || 0) * (amount.value || 0));
const slCost = computed(() => (slPrice.value || 0) * (amount.value || 0));
const tpCost = computed(() => (tpPrice.value || 0) * (amount.value || 0));
// Watchers to trigger store updates
watch(buyPrice, (newVal) => {
	updateOrder(props.blockId, props.orderId, "buyPrice", newVal);
});
watch(amount, (newVal) => {
	updateOrder(props.blockId, props.orderId, "amount", newVal);
});
watch(slPrice, (newVal) => {
	updateOrder(props.blockId, props.orderId, "slPrice", newVal); // Add for slPrice
});
watch(tpPrice, (newVal) => {
	updateOrder(props.blockId, props.orderId, "tpPrice", newVal); // Add for tpPrice
});

const handleRemoveOrder = () => {
	removeOrderFromBlock(props.blockId, props.orderId);
};
</script>

<template>
	<!-- Order Row -->
	<div class="flex justify-between items-center py-2">
		<span>{{ orderId }}</span>
		<input id="buyPrice" type="number" v-model="buyPrice" placeholder="BuyPrice" 
			class="w-[6ch] bg-gray-900 text-center" />
		<input id="amount" type="number" v-model="amount" placeholder="Amount" 
			class="w-[6ch] bg-gray-900 text-center" />
		<span class="">{{ buyOrder }}</span>
		<button id="removeOrder" @click="handleRemoveOrder()"
			class="flex px-2 font-bold text-red-600 border border-red-600 items-center">x</button>
	</div>
	<!-- SL/TP Row -->
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