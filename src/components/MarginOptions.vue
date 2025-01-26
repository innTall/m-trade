<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import MarginSettings from './MarginSettings.vue';
import { useMarginSettingsStore } from '@/stores/marginSettings.js';

const { deposit, leverage, coefRisk, coefTP, coefSL } = storeToRefs(
  useMarginSettingsStore()
);

// Computed properties for calculations
const margin = computed(() => {
  if (!deposit.value || !coefRisk.value) return '0.00';
  return +((deposit.value * coefRisk.value) / 100).toFixed(2);
});

const tpCost = computed(() => {
  if (!margin.value || !leverage.value || !coefTP.value) return '0.00';
  return +((margin.value * leverage.value * coefTP.value) / 100).toFixed(2);
});

const slCost = computed(() => {
  if (!margin.value || !leverage.value || !coefSL.value) return '0.00';
  return +((margin.value * leverage.value * coefSL.value) / 100).toFixed(2);
});
</script>

<template>
  <div class="flex flex-row items-center justify-between">
    <!-- Deposit -->
    <div>
      <div class="text-sm">
        Deposite
      </div>
      <div class="text-sm font-bold text-center">
        {{ deposit }}$
      </div>
    </div>

    <!-- Leverage -->
    <div>
      <div class="text-sm">
        Leverage
      </div>
      <div class="text-sm font-bold text-center">
        {{ leverage }}x
      </div>
    </div>

    <!-- Margin -->
    <div>
      <div class="text-sm">
        M-{{ coefRisk }}%
      </div>
      <div class="text-sm font-bold text-center">
        {{ margin }}$
      </div>
    </div>

    <!-- Take Profit -->
    <div>
      <div class="text-sm">
        TP-{{ coefTP }}%
      </div>
      <div class="text-sm font-bold text-center">
        {{ tpCost }}$
      </div>
    </div>

    <!-- Stop Loss -->
    <div>
      <div class="text-sm">
        SL-{{ coefSL }}%
      </div>
      <div class="text-sm font-bold text-center">
        {{ slCost }}$
      </div>
    </div>
  </div>
</template>

<style scoped></style>
