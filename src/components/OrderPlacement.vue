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
import { useSymbolStore } from '@/stores/symbolStore';
import { useMarginSettingsStore } from '@/stores/marginSettings';
import { useAccountStore } from '@/stores/accountStore';
import {
  calculateTotalFactor,
  calculatePriceLevel,
  calculateOrderQty,
  formatToPrecision,
} from '../helpers';
import ByBit from '@/api/bybit';

// ----------------------------
// Store Setup
// ----------------------------
const symbolStore = useSymbolStore();
const { selectedSymbol } = storeToRefs(symbolStore);
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
  const precision = selectedSymbol.value.priceFilter.tickSize;
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
  if (!price.value || !selectedSymbol.value) return null;
  const lotSizeFilter = selectedSymbol.value.lotSizeFilter;
  const precision = lotSizeFilter.basePrecision;
  const qty = calculateOrderQty({
    amount: orderSize.value / settings.gridSize.value,
    price: price.value,
    lotSizeFilter,
  });
  return formatToPrecision(qty, precision);
});

// Computed values
const totalFactorForSL = computed(() => {
  return calculateTotalFactor([
    settings.coefSL.value,
    settings.coefExtra.value,
  ]);
});

const calculatedStopLoss = computed(() => {
  if (!price.value || !selectedSymbol.value) return null;
  const isTakeProfit = false;
  const precision = selectedSymbol.value.priceFilter.tickSize;
  const priceLevel = calculatePriceLevel(
    price.value,
    totalFactorForSL.value,
    isLong.value,
    isTakeProfit
  );
  return formatToPrecision(priceLevel, precision);
});

const takeProfitGrid = computed(() => {
  const maxGridSize = 10; // Maximum allowed orders

  // Validate stepPercent (must be between 1 and 100)
  if (
    typeof settings.gridStep.value !== 'number' ||
    settings.gridStep.value < 1 ||
    settings.gridStep.value > 100
  ) {
    throw new Error('stepPercent must be a number between 1 and 100.');
  }

  // Validate orders (must be between 1 and maxOrders)
  if (
    typeof settings.gridSize.value !== 'number' ||
    settings.gridSize.value < 1 ||
    settings.gridSize.value > maxGridSize
  ) {
    throw new Error(`orders must be a number between 1 and ${maxGridSize}.`);
  }

  // Generate percentage grid
  return Array.from({ length: settings.gridSize.value }, (_, i) =>
    parseFloat((settings.gridStep.value * (i + 1)).toFixed(0))
  );
});

const calculateTakeProfitPrice = takeProfitFactor => {
  if (!price.value || !selectedSymbol.value) return null;
  const isTakeProfit = true;
  const precision = selectedSymbol.value.priceFilter.tickSize;
  const priceLevel = calculatePriceLevel(
    price.value,
    calculateTotalFactor([takeProfitFactor, settings.coefExtra.value]),
    isLong.value,
    isTakeProfit
  );
  return formatToPrecision(priceLevel, precision);
};

const ordersBatch = computed(() => {
  try {
    return takeProfitGrid.value.map(takeProfitFactor => {
      return {
        symbol: selectedSymbol.value.symbol,
        side: isLong.value ? 'Buy' : 'Sell',
        qty: quantity.value.toString(),
        price: price.value.toString(),
        takeProfit: calculateTakeProfitPrice(takeProfitFactor),
        stopLoss: stopLoss.value.toString(),
        category: 'linear',
        isLeverage: 1,
        orderType: 'Limit',
        tpslMode: 'Full',
      };
    });
  } catch (e) {
    console.error('Error while composing orders batch', e);
    return null;
  }
});

const sendOrder = async () => {
  if (!ordersBatch.value) {
    console.log('There is no orders to place');
    return;
  }

  await Promise.all(
    ordersBatch.value.map(order => {
      ByBit.placeOrder(order);
    })
  );
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
  <div class="max-w-4xl mx-auto p-1 space-y-2">
    <!-- Order Inputs -->
    <div class="p-1 rounded-lg">
      <div class="flex flex-row items-center justify-between">
        <div>
          <ToggleButton
            v-model="isLong"
            onLabel="Long"
            offLabel="Short"
            class="w-20"
          />
        </div>
        <div class="flex">
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
              :min="Number(selectedSymbol?.lotSizeFilter.minOrderAmt)"
              :max="Number(selectedSymbol?.lotSizeFilter.maxOrderAmt)"
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
              :step="Number(selectedSymbol?.priceFilter.tickSize)"
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
  </div>
</template>
