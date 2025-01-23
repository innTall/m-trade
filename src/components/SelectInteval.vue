<script setup>
defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const intervals = [
  '1', // 1 minute
  '3', // 3 minutes
  '5', // 5 minutes
  '15', // 15 minutes
  '30', // 30 minutes
  '60', // 1 hour
  '120', // 2 hours
  '240', // 4 hours
  '360', // 6 hours
  '720', // 12 hours
  'D', // 1 day
  'M', // 1 month
  'W', // 1 week
];

const intervalMapper = {
  1: '1m',
  3: '3m',
  5: '5m',
  15: '15m',
  30: '30m',
  60: '1h',
  120: '2h',
  240: '4h',
  360: '6h',
  720: '12h',
  D: '1D',
  M: '1M',
  W: '1W',
};

// Emit the updated interval to the parent
const onIntervalChange = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <select :value="modelValue" @change="onIntervalChange">
    <option v-for="interval in intervals" :key="interval" :value="interval">
      {{ intervalMapper[interval] }}
    </option>
  </select>
</template>
