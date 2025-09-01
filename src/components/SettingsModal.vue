<script setup>
import { useTradeStore } from "../stores/store.js";
import { useTradeCalc } from "../composables/useTradeCalc.js";
import { X } from "lucide-vue-next";

const store = useTradeStore();
const { a4 } = useTradeCalc();

const props = defineProps({
	open: Boolean
});
const emit = defineEmits(["close"]);
</script>

<template>
	<div v-if="open" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-gray-800 rounded-lg p-6 w-96 relative shadow-lg">
			<!-- Close button -->
			<button @click="emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-white">
				<X class="w-5 h-5" />
			</button>

			<!-- Header -->
			<h2 class="text-lg font-bold text-blue-400 mb-4">⚙️ Input Data</h2>

			<div class="space-y-4">
				<!-- Deposit -->
				<div class="flex items-center gap-2">
					<label class="w-24 text-sm text-gray-300">Depo, $</label>
					<input v-model.number="store.a1" type="number" placeholder="Deposit" class="input-cell flex-1" />
				</div>

				<!-- Risk -->
				<div class="flex items-center gap-2">
					<label class="w-24 text-sm text-gray-300">Risk, %</label>
					<input v-model.number="store.a2" type="number" placeholder="Risk %" class="input-cell flex-1" />
				</div>

				<!-- Fix TP1 -->
				<div class="flex items-center gap-2">
					<label class="w-24 text-sm text-gray-300">Fix TP1, %</label>
					<input v-model.number="store.fixTp1" type="number" placeholder="Fix %" class="input-cell flex-1" />
				</div>

				<!-- SL -->
				<div class="flex text-sm pt-2 gap-2 border-t border-gray-700">
					<span class="text-red-400">SL, $:</span>
					<span class="font-semibold text-red-400">{{ a4 }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
