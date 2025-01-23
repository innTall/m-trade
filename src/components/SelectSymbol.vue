<script setup>
import { ref, onMounted, computed } from 'vue';
import ByBit from '@/api/bybit';

defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const allSymbols = ref([]);

// Emit the updated interval to the parent
const onIntervalChange = (event) => {
  emit('update:modelValue', event.target.value);
};

onMounted(async () => {
  const symbols = await ByBit.getSymbols();
  if (!symbols) return;

  allSymbols.value = symbols;
});

const utaOnlySymbols = computed(() => {
  return allSymbols.value.filter(
    ({ marginTrading }) => marginTrading === 'utaOnly'
  );
});
</script>

<template>
  <select :value="modelValue" @change="onIntervalChange">
    <option v-for="{ symbol } in utaOnlySymbols" :key="symbol" :value="symbol">
      {{ symbol }}
    </option>
  </select>
</template>
