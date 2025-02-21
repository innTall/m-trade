<script setup>
import { computed } from 'vue';
import { Button, ButtonGroup } from 'primevue';
import { usePositionInfoStore } from '@/stores/positionInfoStore';
import { useOrdersStore } from '@/stores/ordersStore';
import { useInstrumentInfoStore } from '../stores/instrumentInfoStore';
import { storeToRefs } from 'pinia';

/**
 * Merges two arrays based on the `symbol` key.
 * Ensures all items from the left array remain while merging `unrealisedPnl` from the right array.
 *
 * @param {Array} mainArray - The primary array (left).
 * @param {Array} pnlArray - The array containing `unrealisedPnl` values (right).
 * @returns {Array} - A merged array with `unrealisedPnl` values.
 *
 * Example:
 * mergeArrays([{ "symbol": "ETH" }, { "symbol": "BTC" }], [{ "symbol": "BTC", "unrealisedPnl": "25.822" }])
 * -> [ { "symbol": "ETH", "unrealisedPnl": "0" }, { "symbol": "BTC", "unrealisedPnl": "25.822" } ]
 */
const mergeArrays = (mainArray, pnlArray) => {
  // Convert pnlArray into a Map for quick lookup using `symbol`
  const pnlMap = new Map(
    pnlArray.map(item => [item.symbol, item.unrealisedPnl])
  );

  // Use a Map to ensure unique symbols from the mainArray
  const resultMap = new Map();

  for (const item of mainArray) {
    if (!resultMap.has(item.symbol)) {
      resultMap.set(item.symbol, {
        ...item,
        unrealisedPnl: pnlMap.get(item.symbol) || '0', // Default to "0" if no match
      });
    }
  }

  // Convert the map values back to an array
  return Array.from(resultMap.values());
};

const positionInfoStore = usePositionInfoStore();
const ordersStore = useOrdersStore();
const instrumentInfoStore = useInstrumentInfoStore();
const { openPositionsWithPnl } = storeToRefs(positionInfoStore);
const { symbolsWithOpenOrders } = storeToRefs(ordersStore);

const activeSymbols = computed(() => {
  return mergeArrays(symbolsWithOpenOrders.value, openPositionsWithPnl.value);
});

const getBadgeSeverity = unrealisedPnl => {
  return parseFloat(unrealisedPnl) > 0 ? 'success' : 'danger';
};
</script>

<template>
  <div>
    <div
      v-if="activeSymbols.length === 0"
      class="flex items-center justify-center"
    >
      <Button
        label="No active symbols"
        variant="text"
        size="small"
        disabled
        severity="secondary"
      />
    </div>
    <div v-else>
      <div class="flex overflow-x-auto">
        <ButtonGroup>
          <Button
            v-for="position in activeSymbols"
            :key="position.symbol"
            :label="position.baseCoin"
            :badge="parseFloat(position.unrealisedPnl).toFixed(2)"
            :badgeSeverity="getBadgeSeverity(position.unrealisedPnl)"
            severity="contrast"
            variant="text"
            size="small"
            class="!rounded-none"
            @click="instrumentInfoStore.selectBaseCoin(position.baseCoin)"
          />
        </ButtonGroup>
      </div>
    </div>
  </div>
</template>
