<script setup>
import { useTradeStore } from "../stores/store.js";
import { useTradeCalc } from "../composables/useTradeCalc.js";
import { sendTelegramMessage } from "../composables/useTelegram.js";

const store = useTradeStore();
const { S1, S2, S3, S5, S10, S11, shortMessage, shortErrors, a4 } = useTradeCalc();

function clearAllShort() {
	store.S_symbol = "";
	store.S4 = 25; // reset leverage
	store.S6 = "";
	store.S7 = "";
	store.S8 = "";
	store.S9 = "";
}

async function sendShort() {
	await sendTelegramMessage(shortMessage.value);
}
</script>

<template>
	<div class="p-4 text-gray-100">
		<!-- Header -->
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl font-bold text-red-400">Short Trade</h2>
			<div class="flex gap-2">
				<button @click="sendShort" class="px-3 py-1 text-sm bg-red-700 hover:bg-red-600 rounded-lg">
					Send 📤
				</button>
				<button @click="clearAllShort" class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg">
					Clear All 🧹
				</button>
			</div>
		</div>

		<!-- Input panel -->
		<div class="grid grid-cols-2 gap-4">
			<!-- Left column -->
			<div class="space-y-2">
				<!-- SL -->
				<div class="relative">
					<input v-model.number="store.S7" type="number" placeholder="SL" class="input-cell text-red-400 pr-8"
						:class="shortErrors.S7 ? 'border-red-500' : 'border-gray-600'" />
					<button v-if="store.S7" @click="store.S7 = ''"
						class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
						🧹
					</button>
				</div>

				<!-- Sell -->
				<div class="relative">
					<input v-model.number="store.S6" type="number" placeholder="Sell" class="input-cell text-blue-400 pr-8" />
					<button v-if="store.S6" @click="store.S6 = ''"
						class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
						🧹
					</button>
				</div>

				<!-- TP1 -->
				<div class="relative">
					<input v-model.number="store.S8" type="number" placeholder="TP1" class="input-cell text-green-400 pr-8"
						:class="shortErrors.S8 ? 'border-red-500' : 'border-gray-600'" />
					<button v-if="store.S8" @click="store.S8 = ''"
						class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
						🧹
					</button>
				</div>

				<!-- TP2 -->
				<div class="relative">
					<input v-model.number="store.S9" type="number" placeholder="TP2" class="input-cell text-green-400 pr-8"
						:class="shortErrors.S9 ? 'border-red-500' : 'border-gray-600'" />
					<button v-if="store.S9" @click="store.S9 = ''"
						class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
						🧹
					</button>
				</div>
			</div>

			<!-- Right column -->
			<div class="space-y-2">
				<!-- Symbol -->
				<div class="relative">
					<input v-model="store.S_symbol" type="text" placeholder="SYMBOL" class="input-cell pr-8"
						@input="store.S_symbol = store.S_symbol.toUpperCase()" />
					<button v-if="store.S_symbol" @click="store.S_symbol = ''"
						class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
						🧹
					</button>
				</div>

				<!-- Leverage -->
				<input v-model.number="store.S4" type="number" placeholder="Leverage" class="input-cell" />

				<div>
					<!-- *Margin -->
					<p class="h-6 text-center text-sm font-bold text-white">
						Margin - <span class="text-white">{{ S5 }}</span> $
					</p>

					<!-- *Sum -->
					<p class="h-6 text-center text-sm font-bold text-white">
						Sum - <span class="text-white">{{ S2 }}</span> $
					</p>

					<!-- *Profit -->
					<p class="h-6 text-center text-sm font-bold text-green-400">
						Profit - {{ S10 }} $
					</p>

					<!-- *Loss -->
					<p class="h-6 text-center text-sm font-bold text-red-400">
						Loss - {{ a4 }} $
					</p>
				</div>
			</div>
		</div>

		<!-- Data row -->
		<div class="flex mt-4 text-gray-400 text-sm gap-3 space-y-1">
			<p># Amount - {{ S1 }}</p>
			<p># LevMax - {{ S3 }}</p>
			<p># RR - {{ S11 }}</p>
		</div>

		<!-- Trading logic -->
		<div class="flex text-sm text-gray-400 gap-3 space-y-1">
			<p># Fix 50% at TP1</p>
			<p># Move SL → BE after TP1</p>
		</div>

		<!-- Telegram preview -->
		<div class="mt-4 bg-gray-900 p-3 rounded-lg">
			<pre class="whitespace-pre-wrap">{{ shortMessage }}</pre>
		</div>
	</div>
</template>

<style scoped></style>
