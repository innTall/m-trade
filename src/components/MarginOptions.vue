<script setup>
import MarginSettings from './MarginSettings.vue';
import { storeToRefs } from 'pinia';
import { useMarginSettingsStore } from '@/stores/marginSettings.js';
import { useMarginOptionsStore } from '@/stores/marginOptions.js';
const { deposit, leverage, coefRisk, coefTP, coefSL } = storeToRefs(
  useMarginSettingsStore()
);
const { margin, tpCost, slCost } = storeToRefs(useMarginOptionsStore());
</script>

<template>
  <div class="p-2 bg-surface-900">
    <div class="flex flex-row items-center justify-between">
      <!-- Deposit -->
      <div>
        <div class="text-sm text-center">
          Deposite <span class="font-bold">{{ deposit }}$</span>
        </div>
      </div>

      <!-- Leverage -->
      <div>
        <div class="text-sm text-center">
          Leverage <span class="font-bold">{{ leverage }}x</span>
        </div>
      </div>

      <!-- Margin -->
      <div>
        <div class="text-sm text-center">
          M-{{ coefRisk }}% <span class="font-bold">{{ margin }}$</span>
        </div>
      </div>

      <!-- Take Profit -->
      <div>
        <div class="text-sm text-center">
          TP-{{ coefTP }}% <span class="font-bold">{{ tpCost }}$</span>
        </div>
      </div>

      <!-- Stop Loss -->
      <div>
        <div class="text-sm text-center">
          SL-{{ coefSL }}% <span class="font-bold">{{ slCost }}$</span>
        </div>
      </div>
      <MarginSettings />
    </div>
  </div>
</template>
<style scoped></style>
