<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import {
  Button,
  InputNumber,
  ToggleButton,
  FloatLabel,
  Message,
} from 'primevue';
import MarginSettings from './MarginSettings.vue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';
import { useMarginSettingsStore } from '@/stores/marginSettingsStore';
import { useAccountStore } from '@/stores/accountStore';
import {
  calculateTotalFactor,
  calculatePriceLevel,
  calculateOrderQty,
  formatToPrecision,
  getDecimalPlaces,
} from '../helpers';
import ByBit from '@/api/bybit';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import PlaceTakeProfitGrid from './PlaceTakeProfitGrid.vue';

// ----------------------------
// Services
// ----------------------------
const toast = useToast();
const router = useRouter();

// ----------------------------
// Store Setup
// ----------------------------
const instrumentInfoStore = useInstrumentInfoStore();
const { selectedInstrument, selectedBaseCoin } =
  storeToRefs(instrumentInfoStore);
const settings = storeToRefs(useMarginSettingsStore());
const account = storeToRefs(useAccountStore());

// ----------------------------
// Reactive State
// ----------------------------
const price = ref(null);
const orderSize = ref(null);
const stopLoss = ref(null);
const isLong = ref(true);

const zeroPrice = computed(() => {
  const totalFactors = calculateTotalFactor([settings.coefExtra.value]);
  if (!price.value) return null;
  const calculatedPrice = price.value * totalFactors;
  const precision = selectedInstrument.value.priceFilter.tickSize;
  return formatToPrecision(calculatedPrice, precision);
});

const margin = computed(() => {
  if (!account.balance.value || !settings.coefRisk.value) return null;
  return ((account.balance.value * settings.coefRisk.value) / 100).toFixed(2);
});

const calculatedOrderSize = computed(() => {
  if (!margin.value || !settings.leverage.value) return null;
  return (parseFloat(margin.value) * settings.leverage.value).toFixed(2);
});

const quantity = computed(() => {
  if (!price.value || !selectedInstrument.value) return null;
  const lotSizeFilter = selectedInstrument.value.lotSizeFilter;
  const precision = lotSizeFilter.qtyStep;
  const { fullQty, gridQty } = calculateOrderQty({
    amount: orderSize.value,
    price: price.value,
    lotSizeFilter,
    gridSize: settings.gridSize.value,
  });
  return {
    fullQty: formatToPrecision(fullQty, precision),
    gridQty: formatToPrecision(gridQty, precision),
  };
});

// Computed values
const totalFactorForSL = computed(() => {
  return calculateTotalFactor([
    settings.coefSL.value,
    settings.coefExtra.value,
  ]);
});

const calculatedStopLoss = computed(() => {
  if (!price.value || !selectedInstrument.value) return null;
  const isTakeProfit = false;
  const precision = selectedInstrument.value.priceFilter.tickSize;
  const priceLevel = calculatePriceLevel(
    price.value,
    totalFactorForSL.value,
    isLong.value,
    isTakeProfit
  );
  return formatToPrecision(priceLevel, precision);
});

const order = computed(() => {
  return {
    symbol: selectedInstrument.value.symbol,
    side: isLong.value ? 'Buy' : 'Sell',
    qty: quantity.value.fullQty,
    price: price.value.toString(),
    stopLoss: stopLoss.value.toString(),
    category: 'linear',
    orderType: 'Limit',
    tpslMode: 'Full',
  };
});

const sendOrder = async () => {
  if (!order.value) {
    console.log('There is no order to place');
    return;
  }

  const showSuccess = () => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Order placed',
      life: 3000,
    });
  };

  const showError = () => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Order is not placed',
      life: 3000,
    });
  };

  await ByBit.setLeverage({
    symbol: order.value.symbol,
    leverage: settings.leverage.value.toString(),
  });

  const isPlaced = await ByBit.placeOrder(order.value);

  isPlaced ? showSuccess() : showError();
};

// Reset manual input to calculated values(strategy)
const resetOrder = () => {
  orderSize.value = calculatedOrderSize.value;
  stopLoss.value = calculatedStopLoss.value;
};

onMounted(() => {
  orderSize.value = calculatedOrderSize.value;
});

watch(calculatedOrderSize, newValue => {
  if (newValue === null) return;
  orderSize.value = calculatedOrderSize.value;
});

watch(price, () => {
  stopLoss.value = calculatedStopLoss.value;
});
</script>

<template>
  <!-- Order Inputs -->
  <div class="p-2 rounded-lg">
    <div class="flex flex-row items-center justify-between">
      <div class="space-x-2">
        <ToggleButton
          v-model="isLong"
          onLabel="Long"
          offLabel="Short"
          class="w-20"
        />
        <PlaceTakeProfitGrid :is-long="isLong" />
        <Button label="Close" size="small" severity="secondary" />
      </div>
      <div class="flex flex-row">
        <Button
          icon="pi pi-shopping-cart"
          severity="contrast"
          variant="text"
          rounded
          @click="
            router.push({
              name: 'orders',
              query: { baseCoin: selectedBaseCoin },
            })
          "
        />
        <Button
          @click="resetOrder"
          icon="pi pi-refresh"
          severity="contrast"
          variant="text"
          rounded
          aria-label="Refresh"
        />
        <MarginSettings />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-x-2 gap-y-4 pt-4">
      <div>
        <FloatLabel variant="on">
          <InputNumber
            v-model.number="orderSize"
            :defaultValue="calculatedOrderSize"
            inputId="positionSize"
            size="small"
            :min="Number(selectedInstrument?.lotSizeFilter.minNotionalValue)"
            showButtons
            fluid
          />
          <label for="positionSize">Position Size</label>
        </FloatLabel>
        <Message size="small" severity="secondary" variant="simple">
          Default: {{ calculatedOrderSize }}
        </Message>
      </div>
      <div>
        <FloatLabel variant="on">
          <InputNumber
            v-model.number="price"
            inputId="price"
            size="small"
            :step="Number(selectedInstrument?.priceFilter.tickSize)"
            :min="Number(selectedInstrument?.priceFilter.minPrice)"
            :max="Number(selectedInstrument?.priceFilter.maxPrice)"
            :maxFractionDigits="
              getDecimalPlaces(selectedInstrument?.priceFilter.tickSize || 0)
            "
            showButtons
            fluid
          />
          <label for="price">Price</label>
        </FloatLabel>
        <Message size="small" severity="secondary" variant="simple">
          Zero: {{ zeroPrice }}
        </Message>
      </div>
      <div>
        <FloatLabel variant="on">
          <InputNumber
            v-model="stopLoss"
            :defaultValue="calculatedStopLoss"
            inputId="stopLoss"
            size="small"
            :step="Number(selectedInstrument?.priceFilter.tickSize)"
            :min="Number(selectedInstrument?.priceFilter.minPrice)"
            :max="Number(selectedInstrument?.priceFilter.maxPrice)"
            :maxFractionDigits="
              getDecimalPlaces(selectedInstrument?.priceFilter.tickSize || 0)
            "
            showButtons
            fluid
          />
          <label for="stopLoss">Stop Loss</label>
        </FloatLabel>
        <Message size="small" severity="secondary" variant="simple">
          Default: {{ calculatedStopLoss }}
        </Message>
      </div>
      <div>
        <Button
          @click="sendOrder"
          label="Place Order"
          class="w-full"
          size="small"
        />
      </div>
    </div>
  </div>
</template>
