<script setup>
import { storeToRefs } from 'pinia';
import { FloatLabel, Select } from 'primevue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';

const instrumentInfoStore = useInstrumentInfoStore();
const { selectQuote } = instrumentInfoStore;
const { quoteAssets, loading, selectedQuote } =
  storeToRefs(instrumentInfoStore);
</script>

<template>
  <div>
    <FloatLabel variant="on">
      <Select
        :value="selectedQuote"
        :defaultValue="selectedQuote"
        @change="event => selectQuote(event.value)"
        :options="quoteAssets"
        size="small"
        placeholder="Quote"
        :loading="loading"
      />
      <label>Market</label>
    </FloatLabel>
  </div>
</template>
