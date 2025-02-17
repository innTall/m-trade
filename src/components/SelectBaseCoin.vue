<script setup>
import { storeToRefs } from 'pinia';
import { Select } from 'primevue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';

const instrumentInfoStore = useInstrumentInfoStore();
const { selectBaseCoin } = instrumentInfoStore;
const { baseCoinList, loading, selectedBaseCoin } =
  storeToRefs(instrumentInfoStore);
</script>

<template>
  <Select
    :modelValue="selectedBaseCoin"
    :defaultValue="selectedBaseCoin"
    @change="event => selectBaseCoin(event.value)"
    :options="baseCoinList"
    size="small"
    placeholder="Base"
    :loading="loading"
  />
</template>
