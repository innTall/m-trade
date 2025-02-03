<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMarginSettingsStore } from '@/stores/marginSettings.js';
import { useAccountStore } from '@/stores/accountStore';

const { leverage, coefRisk, coefTP, coefSL } = storeToRefs(
  useMarginSettingsStore()
);

const account = storeToRefs(useAccountStore());

// Computed properties for calculations
const margin = computed(() => {
  if (!account.balance.value || !coefRisk.value) return '0.00';
  return +((account.balance.value * coefRisk.value) / 100).toFixed(2);
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
    <!-- Leverage -->
    <div>
      <div class="text-sm">Leverage</div>
      <div class="text-sm font-bold text-center">{{ leverage }}x</div>
    </div>

    <!-- Margin -->
    <div>
      <div class="text-sm">M-{{ coefRisk }}%</div>
      <div class="text-sm font-bold text-center">{{ margin }}$</div>
    </div>

    <!-- Take Profit -->
    <div>
      <div class="text-sm">TP-{{ coefTP }}%</div>
      <div class="text-sm font-bold text-center">{{ tpCost }}$</div>
    </div>

    <!-- Stop Loss -->
    <div>
      <div class="text-sm">SL-{{ coefSL }}%</div>
      <div class="text-sm font-bold text-center">{{ slCost }}$</div>
    </div>
  </div>
</template>

<style scoped></style>
