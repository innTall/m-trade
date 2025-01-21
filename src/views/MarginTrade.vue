<script setup>
import MarginOptions from '../components/MarginOptions.vue';
import OrdersBlock from '../components/OrdersBlock.vue';
import KlinesChart from '../components/KlinesChart.vue';
</script>

<template>
	<div class="flex flex-col h-full">
		<MarginOptions />
		<OrdersBlock />
		<KlinesChart />
	</div>
</template>
<style scoped></style>