import { ref, computed } from 'vue';
import {
  calculateTotalFactor,
  calculatePriceLevel,
  formatToPrecision,
} from '../helpers';

export default function useOrderCalculations(selectedSymbol) {
  const DEFAULT_SETTINGS = {
    deposit: 100,
    leverage: 10,
    riskFactor: 2,
    tpFactor: 3,
    slFactor: 1,
    buyFee: 0.02,
    sellFee: 0.055,
  };

  const settings = ref({ ...DEFAULT_SETTINGS });
  const price = ref(null);
  const positionSide = ref(null);

  const symbol = computed(() => selectedSymbol.value);

  const zeroPrice = computed(() => {
    const totalFactors = calculateTotalFactor([
      settings.value.buyFee,
      settings.value.sellFee,
    ]);
    return price.value * totalFactors;
  });

  const margin = computed(() => {
    if (!settings.value.deposit || !settings.value.riskFactor) return null;
    return ((settings.value.deposit * settings.value.riskFactor) / 100).toFixed(
      2
    );
  });

  const orderSize = computed(() => {
    if (!margin.value || !settings.value.leverage) return null;
    return (parseFloat(margin.value) * settings.value.leverage).toFixed(2);
  });

  // Computed values
  const totalFactorForSL = computed(() => {
    return calculateTotalFactor([
      settings.value.slFactor,
      settings.value.buyFee,
      settings.value.sellFee,
    ]);
  });

  const totalFactorForTP = computed(() => {
    return calculateTotalFactor([
      settings.value.tpFactor,
      settings.value.buyFee,
      settings.value.sellFee,
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
