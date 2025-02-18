<script setup>
import { ref, computed } from 'vue';
import { Button } from 'primevue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';
import { useMarginSettingsStore } from '@/stores/marginSettingsStore';
import { usePositionInfoStore } from '@/stores/positionInfoStore';
import { storeToRefs } from 'pinia';
import {
  calculateTotalFactor,
  calculatePriceLevel,
  formatToPrecision,
  calculateGridQty,
} from '../helpers';
import ByBit from '@/api/ByBit';
import { useToast } from 'primevue';

// ----------------------------
// Services
// ----------------------------
const toast = useToast();

const isLong = ref(true);

const instrumentInfoStore = useInstrumentInfoStore();
const marginSettingsStore = useMarginSettingsStore();
const positionInfoStore = usePositionInfoStore();
const { selectedInstrument, selectedSymbol } = storeToRefs(instrumentInfoStore);
const { positionInfo } = storeToRefs(positionInfoStore);
const settings = storeToRefs(marginSettingsStore);

const selectedSymbolPosition = computed(() => {
  return positionInfo.value.find(({ symbol, side }) => {
    return symbol === selectedSymbol.value && side === 'Buy';
  });
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

const calculateSellPrice = takeProfitFactor => {
  if (!selectedSymbolPosition.value || !selectedInstrument.value) return null;
  const isTakeProfit = true;
  const precision = selectedInstrument.value.priceFilter.tickSize;
  const priceLevel = calculatePriceLevel(
    selectedSymbolPosition.value.avgPrice,
    calculateTotalFactor([takeProfitFactor, settings.coefExtra.value]),
    isLong.value,
    isTakeProfit
  );
  return formatToPrecision(priceLevel, precision);
};

const orders = computed(() => {
  try {
    return takeProfitGrid.value.map(takeProfitFactor => {
      return {
        symbol: selectedInstrument.value.symbol,
        side: 'Sell',
        qty: calculateGridQty({
          fullQty: selectedSymbolPosition.value.size,
          lotSizeFilter: selectedInstrument.value.lotSizeFilter,
          gridSize: settings.gridSize.value,
        }).gridQty.toString(),
        price: calculateSellPrice(takeProfitFactor),
        category: 'linear',
        orderType: 'Limit',
        tpslMode: 'Full',
        reduceOnly: true,
      };
    });
  } catch (e) {
    console.error('Error while composing orders batch', e);
    return null;
  }
});

const showSuccess = () => {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Orders placed',
    life: 3000,
  });
};

const showError = () => {
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: 'Order are not placed',
    life: 3000,
  });
};

const placeTakeProfitOrders = async () => {
  try {
    await Promise.all(
      orders.value.map(order => {
        return ByBit.placeOrder(order);
      })
    );
    showSuccess();
  } catch {
    showError();
  }
};
</script>

<template>
  <Button
    label="Place TP"
    @click="placeTakeProfitOrders"
    outlined
    size="small"
  />
</template>
