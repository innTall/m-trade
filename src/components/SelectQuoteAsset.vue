<script setup>
import { storeToRefs } from 'pinia';
import { FloatLabel, Select } from 'primevue';
import { useSymbolStore } from '@/stores/symbolStore';

const symbolStore = useSymbolStore();
const { selectQuote } = symbolStore;
const { quoteAssets, loading, selectedQuote } = storeToRefs(symbolStore);
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
