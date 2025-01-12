import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useMarginOptionsStore } from "@/stores/marginOptions.js";
import { useMarginSettingsStore } from "@/stores/marginSettings.js";

export const useMarginOrdersStore = defineStore("marginOrders", () => {
  const { leverage, coefOrder, coefTP, buyFee, sellFee } = storeToRefs(
    useMarginSettingsStore()
  );
  const { margin, tpCost, slCost, infoBuyOrder } = storeToRefs(
    useMarginOptionsStore()
	);
	const buyPrice = ref(1.2345);
	
  // Derived constants
  const ratio = computed(() => +(1 + coefOrder.value / 100).toFixed(2));
  const fee = computed(() => buyFee.value + sellFee.value);
	// Function to calculate losses and slSum dynamically
  const calculateMetrics = computed(() => {
    const losses = [];
    const slSums = [];
    const tpRatios = [];
    const slPrices = []; // To store slPrice1, slPrice2, slPrice3
    const amounts = []; // To store calculated amounts
    const zeros = []; // To store zero1, zero2, zero3, etc.
    const tpPrices = []; // To store tpPrice1, tpPrice2, tpPrice3, etc.
    let currentMargin = margin.value;
    let currentSlCost = slCost.value;
    let currentFee = (currentMargin * leverage.value * fee.value) / 100;
    for (let i = 1; i <= 10; i++) {
      // Calculate current loss
      const loss = +(currentSlCost + currentFee).toFixed(3);
      losses.push(loss);
      // Calculate cumulative slSum
      const slSum = +((slSums[i - 2] || 0) + loss).toFixed(3); // Add previous slSum
      slSums.push(slSum);      

      // Calculate amount dynamically
      if (buyPrice.value > 0) {
        const amount = +(
          (currentMargin * leverage.value) /
          buyPrice.value
        ).toFixed(3);
				amounts.push(amount);
				
				// Calculate slPrice for the current step
        const slPrice = +(
          ((currentSlCost + currentFee - buyPrice.value * amount) * -1) /
          amount
        ).toFixed(3);
				slPrices.push(slPrice);

				// Calculate tpRatio for the current step
      	const tpRatio = +(
        	((slSum + currentFee) / currentMargin) * leverage.value
      	).toFixed(3);
				tpRatios.push(tpRatio);

				const zero = +(buyPrice.value * (1 + tpRatio / 100)).toFixed(3);
				zeros.push(zero);
				
				// Calculate tpPrice using coefTP
      	const tpPrice = +(zero * (1 + coefTP.value / 100)).toFixed(3);
      	tpPrices.push(tpPrice);
      } else {
        amounts.push(0); // Default to 0 if buyPrice is invalid
				slPrices.push(0);
				zeros.push(0);
        tpPrices.push(0);
      }

      // Update values for the next iteration
      currentMargin *= ratio.value;
      currentSlCost *= ratio.value;
      currentFee *= ratio.value;
    }
    return { losses, slSums, tpRatios, slPrices, amounts, zeros, tpPrices };
  });
	return { calculateMetrics };
});