<script setup>
import MarginOptions from '../components/MarginOptions.vue';
import MarginSymbols from '../components/MarginSymbols.vue';
import OrdersBlock from '../components/OrdersBlock.vue';
</script>

<template>
	<div class="flex flex-col h-full">
		<MarginOptions />
		<MarginSymbols class="overflow-x-auto" />
		<OrdersBlock />
	</div>
</template>
<style scoped></style>