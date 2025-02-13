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
const instrumentInfoStore = useInstrumentInfoStore();
const { selectedSymbol } = storeToRefs(instrumentInfoStore);
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

// const takeProfitGrid = computed(() => {
//   const maxGridSize = 10; // Maximum allowed orders

//   // Validate stepPercent (must be between 1 and 100)
//   if (
//     typeof settings.gridStep.value !== 'number' ||
//     settings.gridStep.value < 1 ||
//     settings.gridStep.value > 100
//   ) {
//     throw new Error('stepPercent must be a number between 1 and 100.');
//   }

//   // Validate orders (must be between 1 and maxOrders)
//   if (
//     typeof settings.gridSize.value !== 'number' ||
//     settings.gridSize.value < 1 ||
//     settings.gridSize.value > maxGridSize
//   ) {
//     throw new Error(`orders must be a number between 1 and ${maxGridSize}.`);
//   }

//   // Generate percentage grid
//   return Array.from({ length: settings.gridSize.value }, (_, i) =>
//     parseFloat((settings.gridStep.value * (i + 1)).toFixed(0))
//   );
// });

// const calculateTakeProfitPrice = takeProfitFactor => {
//   if (!price.value || !selectedSymbol.value) return null;
//   const isTakeProfit = true;
//   const precision = selectedSymbol.value.priceFilter.tickSize;
//   const priceLevel = calculatePriceLevel(
//     price.value,
//     calculateTotalFactor([takeProfitFactor, settings.coefExtra.value]),
//     isLong.value,
//     isTakeProfit
//   );
//   return formatToPrecision(priceLevel, precision);
// };

const order = computed(() => {
  return {
    symbol: selectedSymbol.value.symbol,
    side: isLong.value ? 'Buy' : 'Sell',
    qty: quantity.value.fullQty,
    price: price.value.toString(),
    stopLoss: stopLoss.value.toString(),
    category: 'linear',
    orderType: 'Limit',
    tpslMode: 'Full',
  };
});

// const takeProfit = computed(() => {
//   try {
//     return takeProfitGrid.value.map(takeProfitFactor => {
//       return {
//         symbol: selectedSymbol.value.symbol,
//         side: isLong.value ? 'Buy' : 'Sell',
//         qty: quantity.value.toString(),
//         price: price.value.toString(),
//         takeProfit: calculateTakeProfitPrice(takeProfitFactor),
//         stopLoss: stopLoss.value.toString(),
//         category: 'linear',
//         orderType: 'Limit',
//         tpslMode: 'Full',
//       };
//     });
//   } catch (e) {
//     console.error('Error while composing orders batch', e);
//     return null;
//   }
// });

const sendOrder = async () => {
  if (!order.value) {
    console.log('There is no order to place');
    return;
  }

  await ByBit.setLeverage({
    symbol: order.value.symbol,
    leverage: settings.leverage.value.toString(),
  });

  await ByBit.placeOrder(order.value);
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
</template>
