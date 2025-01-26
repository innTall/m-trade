import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMarginSettingsStore = defineStore(
  'marginSettings',
  () => {
    const deposit = ref(100);
    const leverage = ref(10);
    const coefRisk = ref(2);
    const coefTP = ref(3);
    const coefSL = ref(1);
    const coefOrder = ref(20);
    const feeBuy = ref(0.02);
    const feeSell = ref(0.055);

    const setSettings = (newSettings) => {
      if (newSettings.deposit !== undefined)
        deposit.value = newSettings.deposit;
      if (newSettings.leverage !== undefined)
        leverage.value = newSettings.leverage;
      if (newSettings.coefRisk !== undefined)
        coefRisk.value = newSettings.coefRisk;
      if (newSettings.coefTP !== undefined) coefTP.value = newSettings.coefTP;
      if (newSettings.coefSL !== undefined) coefSL.value = newSettings.coefSL;
      if (newSettings.coefOrder !== undefined)
        coefOrder.value = newSettings.coefOrder;
      if (newSettings.feeBuy !== undefined) feeBuy.value = newSettings.feeBuy;
      if (newSettings.feeSell !== undefined)
        feeSell.value = newSettings.feeSell;
    };

    const resetSettings = () => {
      deposit.value = 0;
      leverage.value = 0;
      coefRisk.value = 0;
      coefTP.value = 0;
      coefSL.value = 0;
      coefOrder.value = 0;
      feeBuy.value = 0;
      feeSell.value = 0;
    };

    const buyOrderMath = computed(() => {
      if (!leverage.value || !margin.value) return '0.00';
      return +(leverage.value * parseFloat(margin.value)).toFixed(2);
    });

    return {
      deposit,
      leverage,
      coefRisk,
      coefTP,
      coefSL,
      coefOrder,
      feeBuy,
      feeSell,
      buyOrderMath,
      setSettings,
      resetSettings,
    };
  },
  { persist: true }
);
