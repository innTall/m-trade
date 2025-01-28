<script setup>
import { ref, computed, watch } from 'vue';
import { Button, InputNumber, SelectButton } from 'primevue';
import MarginSettings from './MarginSettings.vue';

const DEFAULT_SETTINGS = {
  deposit: 100,
  leverage: 10,
  coefRisk: 2,
  coefTP: 3,
  coefSL: 1,
  coefOrder: 20,
  feeBuy: 0.02,
  feeSell: 0.055,
};

// Reactive state
const settings = ref({ ...DEFAULT_SETTINGS });

const order = ref({
  side: "Buy",
  buyPrice: null,
  amount: null,
  slPrice: null,
  tpPrice: null,
});

const positionSideOptions = ref(["Buy", "Sell"]);

// Helper functions
function calculateDigits(price) {
  if (price === 0) return 5;
  return Math.max(0, 5 - Math.floor(Math.log10(price)));
}

function calculateDigitsLote(digits) {
  return Math.max(0, 4 - digits);
}

const orderIndex = computed(() => {
  return 1; // Replace with actual logic if needed
});

// Helper computed properties
const buyPrice = computed(() => order.value.buyPrice);
const amount = computed(() => order.value.amount);
const feeBuyValue = computed(() => settings.value.feeBuy / 100);
const feeSellValue = computed(() => settings.value.feeSell / 100);
const ratio = computed(() => 1 + settings.value.coefOrder / 100);
const orderSize = computed(() => (margin.value * settings.value.leverage).toFixed(2));
const slVolume = computed(() => ((settings.value.coefSL + settings.value.feeSell) / 100).toFixed(5));
const digits = computed(() => calculateDigits(buyPrice.value || 0));
const digitsLote = computed(() => calculateDigitsLote(digits.value));

// Core computed properties
const margin = computed(() => {
  if (!settings.value.deposit || !settings.value.coefRisk) return '0.00';
  return +((settings.value.deposit * settings.value.coefRisk) / 100).toFixed(2);
});

const buyOrder = computed(() => {
  if (!buyPrice.value || !amount.value || !feeBuyValue.value) return '0.00';
  return (buyPrice.value * amount.value * (1 + feeBuyValue.value)).toFixed(2);
});

const stopLoss = computed(() => {
  if (!buyPrice.value || !order.value.slPrice || !amount.value || !feeSellValue.value) return null;
  return (
    order.value.slPrice * amount.value * (1 + feeSellValue.value) -
    buyOrder.value
  ).toFixed(2);
});

const takeProfit = computed(() => {
  if (!buyPrice.value || !order.value.tpPrice || !amount.value || !feeSellValue.value) return null;
  return (
    order.value.tpPrice * amount.value * (1 + feeSellValue.value) -
    buyOrder.value
  ).toFixed(2);
});

// Theoretical computed properties
const t_BuyOrder = computed(() => {
  if (!orderSize.value || !ratio.value) return null;
  return (orderSize.value * ratio.value ** (orderIndex.value - 1)).toFixed(2);
});

const t_Amount = computed(() => {
  if (!t_BuyOrder.value || !buyPrice.value) return null;
  return (t_BuyOrder.value / buyPrice.value).toFixed(digitsLote.value);
});

const t_SlVolume = computed(() => {
  if (!t_BuyOrder.value || !slVolume.value) return null;
  return (t_BuyOrder.value * slVolume.value).toFixed(5);
});

const t_SlVolumeSum = computed(() => {
  let sum = 0;
  for (let i = 0; i < orderIndex.value; i++) {
    const t_BuyOrderValue = (orderSize.value * ratio.value ** i).toFixed(5);
    const t_SlVolumeValue = (t_BuyOrderValue * slVolume.value).toFixed(5);
    sum += parseFloat(t_SlVolumeValue);
  }
  return sum.toFixed(3);
});

const t_TpIndex = computed(() => {
  if (!t_SlVolumeSum.value || !t_BuyOrder.value) return null;
  return (t_SlVolumeSum.value / t_BuyOrder.value).toFixed(5);
});

const t_SlPrice = computed(() => {
  if (!t_SlVolume.value || !buyPrice.value || !t_Amount.value) return null;
  return +(
    ((t_SlVolume.value - buyPrice.value * t_Amount.value) * -1) /
    t_Amount.value
  ).toFixed(digits.value);
});

const t_ZeroPrice = computed(() => {
  if (!buyPrice.value || !t_TpIndex.value || !digits.value) return null;
  return (buyPrice.value * (1 + parseFloat(t_TpIndex.value))).toFixed(digits.value);
});

const t_TpPrice = computed(() => {
  if (!t_ZeroPrice.value || !settings.value.coefTP || !digits.value) return null;
  return (t_ZeroPrice.value * (1 + settings.value.coefTP / 100)).toFixed(digits.value);
});

// Functions to update and reset settings
const setSettings = (newSettings) => {
  settings.value = { ...settings.value, ...newSettings };
};

const resetSettings = () => {
  settings.value = { ...DEFAULT_SETTINGS };
};

watch([t_Amount, t_SlPrice, t_TpPrice], ([newAmount, newStopLoss, newTakeProfit]) => {
  if (t_Amount) order.value.amount = newAmount
  if (t_SlPrice) order.value.slPrice = newStopLoss
  if (t_TpPrice) order.value.tpPrice = newTakeProfit
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-2 space-y-2">
    <!-- Order Inputs -->
    <div class="p-2 rounded-lg">
      <div class="flex flex-row items-center justify-between">
        <div>Order Parameters</div>
        <MarginSettings />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="integeronly" class="block">Price</label>
          <InputNumber v-model.number="order.buyPrice" inputId="integeronly" fluid size="small" />
        </div>
        <div>
          <label for="integeronly" class="block">Amount</label>
          <InputNumber v-model.number="order.amount" inputId="integeronly" fluid size="small" />
        </div>
        <div>
          <label for="integeronly" class="block">Stop Loss</label>
          <InputNumber v-model.number="order.slPrice" inputId="integeronly" fluid size="small" />
        </div>
        <div>
          <label for="integeronly" class="block">Take Profit</label>
          <InputNumber v-model.number="order.tpPrice" inputId="integeronly" fluid size="small" />
        </div>
      </div>
      <div class="flex flex-row justify-between py-2 gap-4">
        <SelectButton v-model="order.side" :options="positionSideOptions" size="small" />
        <Button label="Place Order" class="w-full" size="small" />
      </div>
    </div>

    <!-- Results Display -->
    <div class="bg-surface-700 p-4 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">Calculations</h2>
      <div class="grid grid-cols-1 divide-y">
        <!-- Header -->
        <div class="grid grid-cols-3 py-2 font-medium">
          <div>Parameter</div>
          <div>Actual</div>
          <div>Theoretical</div>
        </div>

        <!-- Rows -->
        <div class="grid grid-cols-3 py-2">
          <div>Buy Order</div>
          <div>{{ buyOrder || 'N/A' }}</div>
          <div>{{ t_BuyOrder || 'N/A' }}</div>
        </div>
        <div class="grid grid-cols-3 py-2">
          <div>Amount</div>
          <div>{{ amount || 'N/A' }}</div>
          <div>{{ t_Amount || 'N/A' }}</div>
        </div>
        <div class="grid grid-cols-3 py-2">
          <div>Stop Loss</div>
          <div>{{ stopLoss || 'N/A' }}</div>
          <div>{{ t_SlPrice || 'N/A' }}</div>
        </div>
        <div class="grid grid-cols-3 py-2">
          <div>Take Profit</div>
          <div>{{ takeProfit || 'N/A' }}</div>
          <div>{{ t_TpPrice || 'N/A' }}</div>
        </div>
        <div class="grid grid-cols-3 py-2">
          <div>Zero Price</div>
          <div>-</div>
          <div>{{ t_ZeroPrice || 'N/A' }}</div>
        </div>
        <div class="grid grid-cols-3 py-2">
          <div>SL Volume</div>
          <div>-</div>
          <div>{{ t_SlVolumeSum || 'N/A' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>