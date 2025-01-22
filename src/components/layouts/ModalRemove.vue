<script setup>
import { storeToRefs } from 'pinia';
import { useModalRemoveStore } from "@/stores/modalRemove.js";
const { showModalRemove, confirmMessage } = storeToRefs(useModalRemoveStore());
const { openDialog, confirmAction, cancelAction, } = useModalRemoveStore();
</script>

<template>
	<div v-if="showModalRemove" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-gray-700 rounded-lg shadow-lg w-1/2 max-w-md p-4 text-center">
			<p class="text-sm text-white">{{ confirmMessage }}</p>
			<div class="mt-4 flex justify-center space-x-4">
				<button @click="confirmAction" class="bg-green-600 hover:bg-green-400 text-white px-4 py-2 rounded transition">
					Yes
				</button>
				<button @click="cancelAction" class="bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded transition">
					No
				</button>
			</div>
		</div>
	</div>
</template>
<style scoped></style>