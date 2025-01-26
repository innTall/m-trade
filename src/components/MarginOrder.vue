<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useOrdersBlockStore } from '@/stores/ordersBlock.js';
import { useMarginOptionsStore } from "@/stores/marginOptions.js";
import { useMarginSettingsStore } from "@/stores/marginSettings.js";

const { blocks } = storeToRefs(useOrdersBlockStore());
const { addOrder, removeOrder } = useOrdersBlockStore();
const { leverage, coefOrder, coefTP, coefSL, feeBuy, feeSell } = storeToRefs(
	useMarginSettingsStore()
);
const { margin, slCost } = storeToRefs(useMarginOptionsStore());

const props = defineProps({
	order: Object,
	blockId: Number,
});

//const buyPrice = ref(props.order.buyPrice);
const buyPrice = computed({
	get: () => props.order.buyPrice,
	set: (value) => {
		props.order.buyPrice = value;
	},
});

// ----- THE PARTE OF REAL VARIABLES -----
const amount = computed({
	get: () => props.order.amount,
	set: (value) => {
		props.order.amount = value;
		props.order.real.buyOrder = buyOrder.value; // Update `buyOrder` when `amount` changes
	},
});

const selectedSwitch = computed({
	get: () => props.order.selectedSwitch || null,
	set: (value) => {
		props.order.selectedSwitch = value;
	},
});

const slPrice = computed({
	get: () => props.order.slPrice || null,
	set: (value) => {
		props.order.slPrice = value;
	},
});

const tpPrice = computed({
	get: () => props.order.tpPrice || null,
	set: (value) => {
		props.order.tpPrice = value;
	},
});

const buyOrder = computed(() => {
	return buyPrice.value && amount.value && feeBuy.value ? (buyPrice.value * amount.value * (1 + feeBuy.value / 100)).toFixed(2) : null; // Replace '1' with real amount
});
const stopLoss = computed(() => {
	if (buyPrice.value && slPrice.value && amount.value && feeSell.value) {
		return ((slPrice.value * amount.value * (1 + feeSell.value / 100) - buyOrder.value)).toFixed(2);
	}
	return null;
});
const takeProfit = computed(() => {
	if (buyPrice.value && tpPrice.value && amount.value && feeSell.value) {
		return ((tpPrice.value * amount.value * (1 + feeSell.value / 100) - buyOrder.value) ).toFixed(2);
	}
	return null;
});

// ----- THE PARTE OF THEORETICAL VARIABLES -----
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

// ----- Helper variables for calculation -----
const digits = computed(() => calculateDigits(buyPrice.value || 0));
const digitsLote = computed(() => calculateDigitsLote(digits.value));
const ratio = computed(() => (1 + coefOrder.value / 100).toFixed(2));
const orderSize = computed(() => (margin.value * leverage.value).toFixed(2));
const slVolume = computed(() => ((coefSL.value + feeSell.value) / 100).toFixed(5));
// ----- t_BuyOrder Calculation -----
const orderIndex = computed(() => {
	// Find the index of the current order within the block
	const blockOrders = blocks.value.find((block) => block.id === props.blockId)?.orders || [];
	return blockOrders.findIndex((o) => o.id === props.order.id) + 1; // +1 to make it 1-based index
});

const t_BuyOrder = computed(() => {
	if (orderIndex.value > 0) {
		return (orderSize.value * (ratio.value ** (orderIndex.value - 1))).toFixed(2);
	}
	return null;
});

// Compute t_Amount dynamically based on t_BuyOrder and buyPrice
const t_Amount = computed(() => {
	if (t_BuyOrder.value && buyPrice.value) {
		return (t_BuyOrder.value / buyPrice.value).toFixed(digitsLote.value);
	}
	return null;
});

const t_SlVolume = computed(() => {
	if (t_BuyOrder.value && slVolume.value) {
		return (t_BuyOrder.value * slVolume.value).toFixed(5);
	}
	return null;
});

const t_SlVolumeSum = computed(() => {
	const blockOrders = blocks.value.find((block) => block.id === props.blockId)?.orders || [];
	let sum = 0;
	for (let i = 0; i < orderIndex.value; i++) {
		const order = blockOrders[i];
		const t_BuyOrderValue = (orderSize.value * (ratio.value ** i)).toFixed(5);
		const t_SlVolumeValue = (t_BuyOrderValue * slVolume.value).toFixed(5);
		sum += parseFloat(t_SlVolumeValue);
	}
	return sum.toFixed(3);
});

// ----- t_TpIndex Calculation -----
const t_TpIndex = computed(() => {
	if (t_SlVolumeSum.value && t_BuyOrder.value) {
		return (t_SlVolumeSum.value / t_BuyOrder.value).toFixed(5);
	}
	return null;
});

// ----- t_SlPrice Calculation -----
const t_SlPrice = computed(() => {
	if (t_SlVolume.value && buyPrice.value && t_Amount.value) {
		return +(
			((t_SlVolume.value - buyPrice.value * t_Amount.value) * -1) /
			t_Amount.value
		).toFixed(digits.value);
	}
	return null;
});

// ----- t_ZeroPrice Calculation -----
const t_ZeroPrice = computed(() => {
	if (buyPrice.value && t_TpIndex.value && digits.value) {
		return (buyPrice.value * (1 + parseFloat(t_TpIndex.value))).toFixed(digits.value);
	}
	return null;
});

// ----- t_TpPrice Calculation -----
const t_TpPrice = computed(() => {
	if (t_ZeroPrice.value && coefTP.value && digits.value) {
		return (t_ZeroPrice.value * (1 + coefTP.value / 100)).toFixed(digits.value);
	}
	return null;
});

console.log(t_SlVolume.value, t_TpIndex.value);
console.log(t_SlPrice.value);
watch([buyPrice, amount, orderIndex], () => {
	props.order.real.buyOrder = buyOrder.value;
	props.order.theoretical.t_buyOrder = t_BuyOrder.value;
	props.order.theoretical.t_amount = t_Amount.value;
	props.order.theoretical.t_slVolume = t_SlVolume.value;
	props.order.theoretical.t_slVolumeSum = t_SlVolumeSum.value;
	props.order.theoretical.t_tpIndex = t_TpIndex.value;
	props.order.theoretical.t_slPrice = t_SlPrice.value;
	props.order.theoretical.t_zeroPrice = t_ZeroPrice.value;
});

const handleRemoveOrder = () => {
	removeOrder(props.blockId, props.order.id);
};
</script>

<template>
	<div class="border-b py-2">
		<div class="flex justify-between items-center pb-2">
			<span>{{ order.id }}</span>
			<input :id="'buyPrice-' + order.id" type="number" v-model="buyPrice" placeholder="BuyPrice" autocomplete="off"
				class="w-[6ch] bg-gray-900 text-center" />
			<input :id="'amount-' + order.id" type="number" v-model="amount" placeholder="Amount"
				class="w-[6ch] bg-gray-900 text-center" />
			<span class="">{{ buyOrder ?? "0.00" }}</span>
			<div class="text-gray-500 text-xs">
				<span class="text-blue-500">({{ t_ZeroPrice ?? "0.00" }} - </span>
				<span>{{ t_Amount ?? "0.00" }} - </span>
				<span>{{ t_BuyOrder ?? "0.00" }})</span>
			</div>
			<button id="removeOrder" @click="handleRemoveOrder"
				class="flex px-2 font-bold text-red-600 border border-red-600 items-center">x</button>
		</div>
		<!-- SL/TP Row -->
		<div class="flex justify-between items-center">
			<!-- SL Switch -->
			<div class="flex items-center">
				<input :id="'sl-' + order.id" type="radio" :name="'switchGroup-' + order.id" v-model="selectedSwitch" value="sl"
					class="accent-red-600" />
				<span :class="selectedSwitch === 'sl' ? 'text-red-500' : ''">SL</span>
			</div>
			<input :id="'slPrice-' + order.id" type="number" v-model="slPrice" placeholder="SLprice"
				:class="`w-[6ch] text-center bg-gray-900 ${selectedSwitch === 'sl' ? 'text-red-500' : ''}`" />
			<span :class="selectedSwitch === 'sl' ? 'text-red-500' : ''">
				{{ stopLoss ?? "0.00" }}
			</span>
			<span class="text-gray-500 text-xs">({{ t_SlPrice ?? "0.00" }})</span>
			<!-- TP Switch -->
			<div class="flex items-center">
				<input :id="'tp-' + order.id" type="radio" :name="'switchGroup-' + order.id" v-model="selectedSwitch" value="tp"
					class="accent-green-600" />
				<span :class="selectedSwitch === 'tp' ? 'text-green-500' : ''">TP</span>
			</div>
			<input :id="'tpPrice-' + order.id" type="number" v-model="tpPrice" placeholder="TPprice"
				:class="`w-[6ch] text-center bg-gray-900 ${selectedSwitch === 'tp' ? 'text-green-500' : ''}`" />
			<span :class="selectedSwitch === 'tp' ? 'text-green-500' : ''">
				{{ takeProfit ?? "0.00" }}
			</span>
			<span class="text-gray-500 text-xs">({{ t_TpPrice ?? "0.00" }})</span>
		</div>
	</div>
	<div class="mt-4">
		<p>{{ order.real.actualValue }}</p>
		<p>{{ order.theoretical.calculatedValue }}</p>
	</div>
</template>
<style scoped></style>