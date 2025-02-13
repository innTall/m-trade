<script setup>
import { computed } from 'vue';
import { Button, ButtonGroup } from 'primevue';
import { usePositionInfoStore } from '@/stores/positionInfoStore';
import { useOrdersStore } from '@/stores/ordersStore';
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
  // Convert pnlArray into a Map for quick lookup
  const pnlMap = new Map(
    pnlArray.map(item => [item.baseAsset, item.unrealisedPnl])
  );

  // Merge the two arrays
  return mainArray.map(item => ({
    ...item,
    unrealisedPnl: pnlMap.get(item.baseAsset) || '0', // Default to "0" if no match
  }));
};

const positionInfoStore = usePositionInfoStore();
const ordersStore = useOrdersStore();
const { openPositionsWithPnl } = storeToRefs(positionInfoStore);
const { symbolsWithOpenOrders } = storeToRefs(ordersStore);

const activeSymbols = computed(() => {
  return mergeArrays(symbolsWithOpenOrders.value, openPositionsWithPnl.value);
});

const getBadgeSeverity = unrealisedPnl => {
  return parseInt(unrealisedPnl) > 0 ? 'success' : 'danger';
};
</script>

<template>
  <div>
    <p v-if="activeSymbols.length === 0">No active symbols</p>
    <div v-else class="flex">
      <div class="flex overflow-x-auto">
        <ButtonGroup>
          <Button
            v-for="position in activeSymbols"
            :key="position.id"
            :label="position.baseAsset"
            :badge="parseFloat(position.unrealisedPnl).toFixed(2)"
            :badgeSeverity="getBadgeSeverity(position.unrealisedPnl)"
            severity="contrast"
            variant="outlined"
            size="small"
          />
        </ButtonGroup>
      </div>
    </div>
  </div>
</template>
