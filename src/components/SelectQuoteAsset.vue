<script setup>
import { storeToRefs } from 'pinia';
import { Select } from 'primevue';
import { useSymbolStore } from '@/stores/symbolStore';

const symbolStore = useSymbolStore();
const { selectQuote } = symbolStore;
const { quoteAssets, loading, selectedQuote } = storeToRefs(symbolStore);
</script>

<template>
  <Select
    :value="selectedQuote"
    :defaultValue="selectedQuote"
    @change="event => selectQuote(event.value)"
    :options="quoteAssets"
    size="small"
    placeholder="Quote"
    :loading="loading"
  />
</template>
