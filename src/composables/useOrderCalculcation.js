import { ref, computed } from 'vue';
import {
  calculateTotalFactor,
  calculatePriceLevel,
  formatToPrecision,
} from '../helpers';

export default function useOrderCalculations({ symbol, settings, account }) {
  const price = ref(null);
  const positionSide = ref(null);

  const zeroPrice = computed(() => {
    const totalFactors = calculateTotalFactor([settings.coefExtra.value]);
    return price.value * totalFactors;
  });
  const margin = computed(() => {
    if (!account.balance.value || !settings.coefRisk.value) return null;
    return ((account.balance.value * settings.coefRisk.value) / 100).toFixed(2);
  });

  const orderSize = computed(() => {
    if (!margin.value || !settings.leverage.value) return null;
    return (parseFloat(margin.value) * settings.leverage.value).toFixed(2);
  });

  // Computed values
  const totalFactorForSL = computed(() => {
    return calculateTotalFactor([
      settings.coefSL.value,
      settings.coefExtra.value,
    ]);
  });

  const totalFactorForTP = computed(() => {
    return calculateTotalFactor([
      settings.coefTP.value,
      settings.coefExtra.value,
    ]);
  });

  const isLongPosition = computed(() => {
    return positionSide.value === 'Buy';
  });

  const stopLoss = computed(() => {
    if (!price.value || !symbol.value) return null;
    const isTakeProfit = false;
    const precision = symbol.value.priceFilter.tickSize;
    const priceLevel = calculatePriceLevel(
      price.value,
      totalFactorForSL.value,
      isLongPosition.value,
      isTakeProfit
    );
    return formatToPrecision(priceLevel, precision);
  });

  const takeProfit = computed(() => {
    if (!price.value || !symbol.value) return null;
    const isTakeProfit = true;
    const precision = symbol.value.priceFilter.tickSize;
    const priceLevel = calculatePriceLevel(
      price.value,
      totalFactorForTP.value,
      isLongPosition.value,
      isTakeProfit
    );
    return formatToPrecision(priceLevel, precision);
  });

  // Function to update price
  const updatePrice = value => {
    price.value = value;
  };

  const updatePositionSide = value => {
    positionSide.value = value;
  };

  return {
    stopLoss,
    takeProfit,
    orderSize,
    zeroPrice,
    updatePrice,
    updatePositionSide,
  };
}
