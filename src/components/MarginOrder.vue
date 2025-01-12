<script setup>
import { storeToRefs } from "pinia";
import { ref, computed, watch } from 'vue';
import { useOrdersBlockStore } from '@/stores/ordersBlock.js';
import { useMarginSettingsStore } from "@/stores/marginSettings.js";
import { useMarginOptionsStore } from "@/stores/marginOptions.js";
import { useMarginOrdersStore } from "@/stores/marginOrders.js";
const { removeOrderFromBlock, updateOrder } = useOrdersBlockStore();
const { leverage, coefOrder, buyFee, sellFee } = storeToRefs(useMarginSettingsStore());
const { margin, tpCost, slCost, infoBuyOrder } = storeToRefs(useMarginOptionsStore());
const { calculateMetrics } = storeToRefs(useMarginOrdersStore());
console.log(calculateMetrics.value);
// Props for block and order identification
const props = defineProps({
	blockId: Number,
	orderId: Number,
	orderNumber: Number, // Add orderNumber as a prop
});
// ----- Reactive data for input fields -----
const buyPrice = ref(null);
const amount = ref(null);
const slPrice = ref(null);
const tpPrice = ref(null);
const selectedSwitch = ref(null);

// ----- Computed properties for calculated values -----
const buyOrder = computed(() => {
	if (!buyPrice.value || !amount.value) return "0.00";
	return (buyPrice.value * amount.value).toFixed(2);
});

const feeBuy = computed(() => {
	if (!buyOrder.value) return 0;
	return (buyOrder.value * buyFee.value) / 100;
});

const feeSl = computed(() => {
	if (!slPrice.value || !amount.value) return 0;
	return feeBuy.value + (slPrice.value * amount.value * sellFee.value) / 100;
});

const feeTp = computed(() => {
	if (!tpPrice.value || !amount.value) return 0;
	return feeBuy.value + (tpPrice.value * amount.value * sellFee.value) / 100;
});

const stopLoss = computed(() => {
	if (!slPrice.value || !buyPrice.value || !amount.value) return "0.00";
	return ((slPrice.value - buyPrice.value) * amount.value - feeSl.value).toFixed(2);
});

const takeProfit = computed(() => {
	if (!tpPrice.value || !buyPrice.value || !amount.value) return "0.00";
	return ((tpPrice.value - buyPrice.value) * amount.value - feeTp.value).toFixed(2);
});

// ----- Helper functions for precision -----
function calculateDigits(price) {
	if (price >= 10000) return 0;
	if (price >= 1000) return 1;
	if (price >= 100) return 2;
	if (price >= 10) return 2;
	if (price >= 1) return 3;
	if (price >= 0.1) return 4;
	return 5;
}

function calculateDigitsLote(digits) {
	if (digits === 0) return 4;
	if (digits === 1) return 3;
	if (digits === 2) return 2;
	if (digits === 3) return 1;
	return 0;
}
const digits = computed(() => calculateDigits(buyPrice.value || 0));
const digitsLote = computed(() => calculateDigitsLote(digits.value));

// ----- Helper Functions -----
const infoAmount = computed(() => {
	if (!leverage.value || !margin.value || !buyPrice.value) return "0.0000";
	return (leverage.value * margin.value / buyPrice.value).toFixed(digitsLote.value);
});

const infoSlPrice = computed(() => {
	if (!slCost.value || !buyPrice.value || !amount.value) return "0.00";
	return (((slCost.value - buyPrice.value * amount.value) * -1) / amount.value).toFixed(digits.value);
});

const infoTpPrice = computed(() => {
	if (!tpCost.value || !buyPrice.value || !amount.value) return "0.00";
	return ((tpCost.value + buyPrice.value * amount.value) / amount.value).toFixed(digits.value);
});

// Watchers to update store on input changes
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

// ----- Compute balance for the block -----
const blockOrders = computed(() => {
	const block = useOrdersBlockStore().blocks.find(block => block.id === props.blockId);
	return block ? block.orders : [];
});

const balance = computed(() => {
	return blockOrders.value.reduce((sum, order) => {
		if (order.selectedSwitch === 'sl') {
			sum += parseFloat(order.stopLoss || 0);
		} else if (order.selectedSwitch === 'tp') {
			sum += parseFloat(order.takeProfit || 0);
		}
		return sum;
	}, 0).toFixed(2);
});

const balanceColor = computed(() => {
	return balance.value < 0 ? 'text-red-500' : balance.value > 0 ? 'text-green-500' : '';
});
</script>

<template>
	<!-- Order Row -->
	<div class="flex justify-between items-center py-2">
		<span>{{ orderNumber }}</span>
		<input :id="`buyPrice-${blockId}-${orderId}`" type="number" v-model="buyPrice" placeholder="BuyPrice"
			class="w-[6ch] bg-gray-900 text-center" />
		<input :id="`amount-${blockId}-${orderId}`" type="number" v-model="amount" placeholder="Amount"
			class="w-[6ch] bg-gray-900 text-center" />
		<span class="">{{ buyOrder }}</span>
		<div class="text-gray-500 text-xs">
			<span>({{ infoAmount }} - </span>
			<span>{{ infoBuyOrder }})</span>
		</div>
		<button :id="`removeOrder-${blockId}-${orderId}`" @click="handleRemoveOrder()"
			class="flex px-2 font-bold text-red-600 border border-red-600 items-center">x</button>
	</div>
	<!-- SL/TP Row -->
	<div class="flex justify-between items-center pb-2 border-b">
		<!-- SL Switch -->
		<div class="flex items-center">
			<input :id="`sl-${blockId}-${orderId}`" type="radio" :name="`switchGroup-${blockId}-${orderId}`"
				v-model="selectedSwitch" value="sl" class="accent-red-600" />
			<span :class="selectedSwitch === 'sl' ? 'text-red-500' : ''">SL</span>
		</div>
		<input :id="`slPrice-${blockId}-${orderId}`" type="number" v-model="slPrice" placeholder="SLprice"
			:class="`w-[6ch] text-center bg-gray-900 ${selectedSwitch === 'sl' ? 'text-red-500' : ''}`" />
		<span :class="selectedSwitch === 'sl' ? 'text-red-500' : ''">{{ stopLoss }}</span>
		<div class="text-gray-500">
			<span class="text-xs">({{ infoSlPrice }})</span>
		</div>
		<!-- TP Switch -->
		<div class="flex items-center">
			<input :id="`tp-${blockId}-${orderId}`" type="radio" :name="`switchGroup-${blockId}-${orderId}`"
				v-model="selectedSwitch" value="tp" class="accent-green-600" />
			<span :class="selectedSwitch === 'tp' ? 'text-green-500' : ''">TP</span>
		</div>
		<input :id="`tpPrice-${blockId}-${orderId}`" type="number" v-model="tpPrice" placeholder="TPprice"
			:class="`w-[6ch] text-center bg-gray-900 ${selectedSwitch === 'tp' ? 'text-green-500' : ''}`" />
		<span :class="selectedSwitch === 'tp' ? 'text-green-500' : ''">{{ takeProfit }}</span>
		<div class="text-gray-500">
			<span class="text-xs">({{ infoTpPrice }})</span>
		</div>
		<!-- Balance Display -->
		<div class="flex justify-between items-center py-2">
			<span>*</span>
			<span :class="balanceColor">{{ balance }}</span>
		</div>
	</div>
</template>
<style scoped></style>