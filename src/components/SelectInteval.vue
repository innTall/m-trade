<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const intervals = [
  "1",   // 1 minute
  "3",   // 3 minutes
  "5",   // 5 minutes
  "15",  // 15 minutes
  "30",  // 30 minutes
  "60",  // 1 hour
  "120", // 2 hours
  "240", // 4 hours
  "360", // 6 hours
  "720", // 12 hours
  "D",   // 1 day
  "M",   // 1 month
  "W"    // 1 week
];

const intervalMapper = {
  "1": "1 Minute",
  "3": "3 Minutes",
  "5": "5 Minutes",
  "15": "15 Minutes",
  "30": "30 Minutes",
  "60": "1 Hour",
  "120": "2 Hours",
  "240": "4 Hours",
  "360": "6 Hours",
  "720": "12 Hours",
  "D": "1 Day",
  "M": "1 Month",
  "W": "1 Week"
};

// Emit the updated interval to the parent
const onIntervalChange = (event) => {
  emit('update:modelValue', event.target.value);
};

</script>

<template>
  <div>
    <label for="intervals">Select Interval:</label>
    <select id="intervals" :value="modelValue" @change="onIntervalChange">
      <option v-for="interval in intervals" :key="interval" :value="interval">
        {{ intervalMapper[interval] }}
      </option>
    </select>
    <p>Selected Interval: {{ intervalMapper[modelValue] }}</p>
  </div>
</template>