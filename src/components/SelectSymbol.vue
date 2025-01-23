<script setup>
import { ref, onMounted, computed } from 'vue';
import { Select } from 'primevue';
import ByBit from '@/api/bybit';

defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const allSymbols = ref([]);

// Emit the updated interval to the parent
const onIntervalChange = (event) => {
  console.log(event.value);
  emit('update:modelValue', event.value);
};

onMounted(async () => {
  const symbols = await ByBit.getSymbols();
  if (!symbols) return;

  allSymbols.value = symbols;
});

const utaOnlySymbols = computed(() => {
  return allSymbols.value
    .filter(({ marginTrading }) => marginTrading === 'utaOnly')
    .map(({ symbol }) => symbol);
});
</script>

<template>
  <Select
    :value="modelValue"
    :defaultValue="modelValue"
    @change="onIntervalChange"
    :options="utaOnlySymbols"
    size="small"
    placeholder="Symbol"
  />
</template>
