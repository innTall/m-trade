<script setup>
import MarginOptions from '../components/MarginOptions.vue';
import MarginSymbols from '../components/MarginSymbols.vue';
import OrdersBlock from '../components/OrdersBlock.vue';
import ChartSettings from "@/components/ChartSettings.vue";
import CandleChart from '../components/CandleChart.vue';
</script>

<template>
	<div class="flex flex-col h-full">
		<MarginOptions />
		<MarginSymbols class="overflow-x-auto" />
		<OrdersBlock />
		<ChartSettings />
		<CandleChart />
	</div>
</template>
<style scoped></style>