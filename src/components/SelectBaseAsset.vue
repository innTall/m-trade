<script setup>
import { storeToRefs } from 'pinia';
import { Select } from 'primevue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';

const instrumentInfoStore = useInstrumentInfoStore();
const { selectSymbol } = instrumentInfoStore;
const { baseAssets, loading, selectedSymbol } =
  storeToRefs(instrumentInfoStore);
</script>

<template>
  <Select
    :value="selectedSymbol"
    :defaultValue="selectedSymbol"
    @change="event => selectSymbol(event.value)"
    :options="baseAssets"
    optionLabel="baseCoin"
    size="small"
    placeholder="Base"
    :loading="loading"
  />
</template>
