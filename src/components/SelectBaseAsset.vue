<script setup>
import { storeToRefs } from 'pinia';
import { Select } from 'primevue';
import { useSymbolStore } from '@/stores/symbolStore';

const symbolStore = useSymbolStore();
const { selectSymbol } = symbolStore;
const { symbolsByQuote, loading, selectedSymbol } = storeToRefs(symbolStore);
</script>

<template>
  <Select
    :value="selectedSymbol"
    :defaultValue="selectedSymbol"
    @change="event => selectSymbol(event.value)"
    :options="symbolsByQuote"
    optionLabel="baseCoin"
    size="small"
    placeholder="Base"
    :loading="loading"
  />
</template>
