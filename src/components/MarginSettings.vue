<script setup>
import { storeToRefs } from 'pinia';
import { useMarginSettingsStore } from '@/stores/marginSettings.js';

const { openSettings, deposit, leverage, coefRisk, coefTP, coefSL, coefOrder,
	feeBuy, feeSell, } = storeToRefs(useMarginSettingsStore());

const submitForm = (e) => {
	e.preventDefault();
	console.log("Form Submitted");
};
</script>

<template>
	<div class="container mx-auto">
		<button @click="openSettings = true" class="text-sm bg-gray-900 text-white">
			Set
		</button>
		<Teleport to="body">
			<div v-if="openSettings" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
				<div class="bg-gray-900 text-white border rounded-3xl p-4 w-2/3 sm:w-2/3 md:w-1/2 lg:w-1/3 overflow-auto">
					<form @submit="submitForm" class="space-y-4">
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<label for="depo" class="text-sm font-semibold">Deposit:</label>
								<div class="flex items-center gap-2">
									<input id="depo" type="number" v-model="deposit" step="1" required
										class="w-20 bg-gray-700 font-bold text-right p-1 rounded-md" />
									<span>$</span>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<label for="lev" class="text-sm font-semibold">Leverage:</label>
								<div class="flex items-center gap-2">
									<input id="lev" type="number" v-model="leverage" step="1" required
										class="w-20 bg-gray-700 font-bold text-right p-1 rounded-md" />
									<span>X</span>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<label for="mar" class="text-sm font-semibold">Coef. Risk:</label>
								<div class="flex items-center gap-2">
									<input id="mar" type="number" v-model="coefRisk" step="1" required
										class="w-20 bg-gray-700 font-bold text-right p-1 rounded-md" />
									<span>%</span>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<label for="tp" class="text-sm font-semibold">Coef. TP:</label>
								<div class="flex items-center gap-2">
									<input id="tp" type="number" v-model="coefTP" step="0.1" required
										class="w-20 bg-gray-700 font-bold text-right p-1 rounded-md" />
									<span>%</span>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<label for="sl" class="text-sm font-semibold">Coef. SL:</label>
								<div class="flex items-center gap-2">
									<input id="sl" type="number" v-model="coefSL" step="0.1" required
										class="w-20 bg-gray-700 font-bold text-right p-1 rounded-md" />
									<span>%</span>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<label for="cord" class="text-sm font-semibold">Coef. Order:</label>
								<div class="flex items-center gap-2">
									<input id="cord" type="number" v-model="coefOrder" step="0.05" required
										class="w-20 bg-gray-700 font-bold text-right p-1 rounded-md" />
									<span>%</span>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<label for="fb" class="text-sm font-semibold">Fee Buy:</label>
								<div class="flex items-center gap-2">
									<input id="fb" type="number" v-model="feeBuy" step="0.1" required
										class="w-20 bg-gray-700 font-bold text-right p-1 rounded-md" />
									<span>%</span>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<label for="fs" class="text-sm font-semibold">Fee Sell:</label>
								<div class="flex items-center gap-2">
									<input id="fs" type="number" v-model="feeSell" step="0.1" required
										class="w-20 bg-gray-700 font-bold text-right p-1 rounded-md" />
									<span>%</span>
								</div>
							</div>
						</div>
						<div class="flex justify-end space-x-3">
							<button type="button" @click="openSettings = false"
								class="bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600">
								Close
							</button>
							<button type="submit" class="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600">
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</Teleport>
	</div>
</template>
<style scoped></style>