<script setup>
import { ref, onMounted } from 'vue';
import ByBit from '@/api/bybit';

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const symbols = ref([]);

// Emit the updated interval to the parent
const onIntervalChange = (event) => {
  emit('update:modelValue', event.target.value);
};

onMounted(async () => {
  const data = await ByBit.getSymbols();
  if (data?.result && Array.isArray(data.result.list) && data.result.list.length) {
    symbols.value = data.result.list;
  }
})
</script>

<template>
  <div>
    <label for="symbols">Select Symbol:</label>
    <select id="symbols" :value="modelValue" @change="onIntervalChange">
      <option v-for="symbol in symbols" :key="symbol.symbol" :value="symbol.symbol">
        {{ symbol.symbol }}
      </option>
    </select>
    <p>Selected Interval: {{ modelValue }}</p>
  </div>
</template>