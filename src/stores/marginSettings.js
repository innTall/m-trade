import { defineStore } from "pinia";
import { ref } from "vue";

export const useMarginSettingsStore = defineStore(
  "marginSettings",
  () => {
    const openSettings = ref(false);
    const deposit = ref(null);
    const leverage = ref(null);
    const coefRisk = ref(null);
    const coefTP = ref(null);
		const coefSL = ref(null);
		const coefOrder = ref(null);
		const buyFee = ref(null);
		const sellFee = ref(null);

    // Actions
    const toggleSettings = () => {
      openSettings.value = !openSettings.value;
    };

    const setSettings = (newSettings) => {
      if (newSettings.deposit !== undefined) deposit.value = newSettings.deposit;
      if (newSettings.leverage !== undefined) leverage.value = newSettings.leverage;
      if (newSettings.coefRisk !== undefined) coefRisk.value = newSettings.coefRisk;
      if (newSettings.coefTP !== undefined) coefTP.value = newSettings.coefTP;
      if (newSettings.coefSL !== undefined)	coefSL.value = newSettings.coefSL;
			if (newSettings.coefOrder !== undefined) coefOrder.value = newSettings.coefOrder;
      if (newSettings.buyFee !== undefined) buyFee.value = newSettings.buyFee;
      if (newSettings.sellFee !== undefined) sellFee.value = newSettings.sellFee;
    };

    const resetSettings = () => {
      deposit.value = 0;
      leverage.value = 0;
      coefRisk.value = 0;
      coefTP.value = 0;
			coefSL.value = 0;
			coefOrder = 0;
      buyFee = 0;
      sellFee = 0;
    };

    return {
      openSettings,
      deposit,
      leverage,
      coefRisk,
      coefTP,
			coefSL,
			coefOrder,
      buyFee,
      sellFee,
      toggleSettings,
      setSettings,
      resetSettings,
    };
  },
  { persist: true }
);
