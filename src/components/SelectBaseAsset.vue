<script setup>
import { storeToRefs } from 'pinia';
import { Select } from 'primevue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';

const instrumentInfoStore = useInstrumentInfoStore();
const { selectSymbol } = instrumentInfoStore;
const { symbolsByQuote, loading, selectedSymbol } =
  storeToRefs(instrumentInfoStore);
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
