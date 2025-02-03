<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Button, InputNumber, SelectButton } from 'primevue';
import MarginSettings from './MarginSettings.vue';
import { useSymbolStore } from '@/stores/symbolStore';
import { useMarginSettingsStore } from '../stores/marginSettings';
import { useOrderCalculations } from '@/composables';
import { calculateOrderQty, formatToPrecision } from '../helpers';
import ByBit from '@/api/bybit';

// ----------------------------
// Constants
// ----------------------------
const ORDER_SIDE_OPTIONS = ['Buy', 'Sell'];

// ----------------------------
// Store Setup
// ----------------------------
const symbolStore = useSymbolStore();
const { selectedSymbol, loading } = storeToRefs(symbolStore);
const settings = storeToRefs(useMarginSettingsStore());

// ----------------------------
// Reactive State
// ----------------------------
const price = ref(null);
const orderSide = ref('Buy');
const orderSize = ref(null);
const takeProfit = ref(null);
const stopLoss = ref(null);

// ----------------------------
// Composables
// ----------------------------
const {
  orderSize: calculatedOrderSize,
  stopLoss: calculatedStopLoss,
  takeProfit: calculatedTakeProfit,
  updatePrice,
  updatePositionSide,
} = useOrderCalculations({ symbol: selectedSymbol, settings });

// ----------------------------
// Computed
// ----------------------------
const quantity = computed(() => {
  if (!price.value || !selectedSymbol.value) return null;
  const lotSizeFilter = selectedSymbol.value.lotSizeFilter;
  const precision = lotSizeFilter.basePrecision;
  const qty = calculateOrderQty({
    amount: orderSize.value,
    price: price.value,
    lotSizeFilter,
  });
  return formatToPrecision(qty, precision);
});

const sendOrder = async () => {
  console.log({
    symbol: selectedSymbol.value.symbol,
    side: orderSide.value,
    qty: quantity.value.toString(),
    price: price.value.toString(),
    takeProfit: takeProfit.value.toString(),
    stopLoss: stopLoss.value.toString(),
  });
  // await ByBit.placeOrder({
  //   symbol: selectedSymbol.value.symbol,
  //   side: orderSide.value,
  //   qty: calculatedQuantity.value,
  //   price: price.value.toString(),
  //   takeProfit: takeProfit.value,
  //   stopLoss: stopLoss.value,
  // });
};

// Reset manual input to calculated values(strategy)
const resetOrder = () => {
  orderSize.value = calculatedOrderSize.value;
  takeProfit.value = calculatedTakeProfit.value;
  stopLoss.value = calculatedStopLoss.value;
};

onMounted(() => {
  // Add default position
  updatePositionSide(orderSide.value);
});

watch(price, newPrice => {
  updatePrice(newPrice);
  takeProfit.value = calculatedTakeProfit.value;
  stopLoss.value = calculatedStopLoss.value;
});

watch(orderSide, newValue => {
  updatePositionSide(newValue);
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-2 space-y-2">
    <!-- Order Inputs -->
    <div class="p-2 rounded-lg">
      <div class="flex flex-row items-center justify-between">
        <div>Order Parameters</div>
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
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="integeronly" class="block">Price</label>
          <InputNumber
            v-model.number="price"
            inputId="integeronly"
            size="small"
            :step="Number(selectedSymbol?.priceFilter.tickSize)"
            showButtons
            fluid
          />
        </div>
        <div>
          <label for="integeronly" class="block">Position Size</label>
          <InputNumber
            v-model.number="orderSize"
            :defaultValue="calculatedOrderSize"
            inputId="integeronly"
            size="small"
            :min="Number(selectedSymbol?.lotSizeFilter.minOrderAmt)"
            :max="Number(selectedSymbol?.lotSizeFilter.maxOrderAmt)"
            showButtons
            fluid
          />
        </div>
        <div>
          <label for="integeronly" class="block">Stop Loss</label>
          <InputNumber
            v-model="stopLoss"
            :defaultValue="calculatedStopLoss"
            inputId="integeronly"
            size="small"
            showButtons
            fluid
          />
        </div>
        <div>
          <label for="integeronly" class="block">Take Profit</label>
          <InputNumber
            v-model.number="takeProfit"
            :defaultValue="calculatedTakeProfit"
            inputId="integeronly"
            size="small"
            showButtons
            fluid
          />
        </div>
      </div>
      <div class="flex flex-row justify-between py-2 gap-4">
        <SelectButton
          v-model="orderSide"
          :options="ORDER_SIDE_OPTIONS"
          size="small"
        />
        <Button
          @click="sendOrder"
          label="Place Order"
          class="w-full"
          size="small"
        />
      </div>
    </div>

    <!-- Results Display -->
    <!-- <div class="bg-surface-700 p-4 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">Calculations</h2>
      <div class="grid grid-cols-1 divide-y"> -->
    <!-- Header -->
    <!-- <div class="grid grid-cols-3 py-2 font-medium">
          <div>Parameter</div>
          <div>Actual</div>
          <div>Theoretical</div>
        </div> -->

    <!-- Rows -->
    <!-- <div class="grid grid-cols-3 py-2">
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
        </div> -->
    <!-- </div>
    </div> -->
  </div>
</template>
