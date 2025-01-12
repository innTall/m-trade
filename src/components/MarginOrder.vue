<script setup>
import { ref, computed, watch } from 'vue';
import { useOrdersBlockStore } from '@/stores/ordersBlock.js';
const { removeOrderFromBlock, updateOrder } = useOrdersBlockStore();
// Props for block and order identification
const props = defineProps({
	blockId: Number,
	orderId: Number,
	orderNumber: Number, // Add orderNumber as a prop
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
		<span>{{ orderNumber }}</span>
		<input :id="`buyPrice-${blockId}-${orderId}`" type="number" v-model="buyPrice" placeholder="BuyPrice"
			class="w-[6ch] bg-gray-900 text-center" />
		<input :id="`amount-${blockId}-${orderId}`" type="number" v-model="amount" placeholder="Amount" class="w-[6ch] bg-gray-900 text-center" />
		<span class="">{{ buyOrder }}</span>
		<button :id="`removeOrder-${blockId}-${orderId}`" @click="handleRemoveOrder()"
			class="flex px-2 font-bold text-red-600 border border-red-600 items-center">x</button>
	</div>
	<!-- SL/TP Row -->
	<div class="flex justify-between items-center pb-2 border-b">
		<!-- SL Switch -->
		<div class="flex items-center">
			<input :id="`sl-${blockId}-${orderId}`" type="radio" :name="`switchGroup-${blockId}-${orderId}`" v-model="selectedSwitch" value="sl" class="accent-red-600" />
			<span class="">SL</span>
		</div>
		<input :id="`slPrice-${blockId}-${orderId}`" type="number" v-model="slPrice" placeholder="SLprice" class="w-[6ch] bg-gray-900 text-center" />
		<span class="">{{ slCost }}</span>
		<!-- TP Switch -->
		<div class="flex items-center">
			<input :id="`tp-${blockId}-${orderId}`" type="radio" :name="`switchGroup-${blockId}-${orderId}`" v-model="selectedSwitch" value="tp" class="accent-green-600" />
			<span class="">TP</span>
		</div>
		<input :id="`tpPrice-${blockId}-${orderId}`" type="number" v-model="tpPrice" placeholder="TPprice" class="w-[6ch] bg-gray-900 text-center" />
		<span class="">{{ tpCost }}</span>
	</div>
</template>
<style scoped></style>