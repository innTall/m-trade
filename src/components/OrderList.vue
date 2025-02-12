<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Button, Dialog, InputNumber, Divider } from 'primevue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';
import ByBit from '@/api/bybit';

const instrumentInfoStore = useInstrumentInfoStore();
const { selectedSymbol } = storeToRefs(instrumentInfoStore);
const orders = ref([]);
const position = ref('center');
const visible = ref(false);

const openPosition = pos => {
  position.value = pos;
  visible.value = true;
};

setInterval(async () => {
  const result = await ByBit.getOrderHistory({
    symbol: selectedSymbol.value.symbol,
  });
  if (!result) return;
  orders.value = result;
}, 10000);

// Watchers for symbol and interval changes
watch(selectedSymbol, async newSymbol => {
  const result = await ByBit.getOrderHistory({ symbol: newSymbol.symbol });
  if (!result) return;
  orders.value = result;
});
</script>

<template>
  <div
    v-for="(order, index) in orders"
    :key="index"
    class="h-full overflow-y-auto p-2"
  >
    <div class="flex items-center">
      <div class="flex-grow">
        <div class="flex justify-between">
          <div class="px-2">
            {{ order.side }} {{ order.orderType }} ({{ order.orderStatus }})
          </div>
          <div class="px-2">Price: {{ order.price }}</div>
        </div>

        <div class="flex justify-between">
          <div class="px-2">Qty: {{ order.qty }}</div>

          <div class="px-2">
            TP/SL: {{ order.takeProfit || '-' }}/{{ order.stopLoss || '-' }}
          </div>
        </div>
      </div>
      <div>
        <Button
          icon="pi pi-pen-to-square"
          aria-label="Cog"
          variant="text"
          severity="contrast"
          @click="openPosition('bottom')"
        />
        <Dialog
          v-model:visible="visible"
          header="Modify Order"
          :position="position"
          :modal="true"
          :draggable="false"
        >
          <div class="space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-4">
                <label for="lev">Leverage</label>
                <InputNumber
                  id="lev"
                  v-model="leverage"
                  suffix="x"
                  class="text-right"
                  size="small"
                />
              </div>
              <Divider>Coeficients</Divider>
              <div class="flex items-center justify-between gap-4">
                <label for="mar">Risk</label>
                <InputNumber
                  id="risk"
                  v-model="coefRisk"
                  suffix="%"
                  class="text-right"
                  size="small"
                  :min="1"
                  :max="100"
                  :step="1"
                />
              </div>
              <div class="flex items-center justify-between gap-4">
                <label for="sl">SL</label>
                <InputNumber
                  id="sl"
                  v-model="coefSL"
                  suffix="%"
                  class="text-right"
                  size="small"
                  :min="1"
                  :max="100"
                  :step="1"
                />
              </div>
              <div class="flex items-center justify-between gap-4">
                <label for="extra">Extra</label>
                <InputNumber
                  id="extra"
                  v-model="coefExtra"
                  suffix="%"
                  class="text-right"
                  size="small"
                  :min="0.01"
                  :max="1"
                  :step="0.01"
                />
              </div>
              <Divider>Grid</Divider>
              <div class="flex items-center justify-between gap-4">
                <label for="size">Size</label>
                <InputNumber
                  id="size"
                  v-model="gridSize"
                  class="text-right"
                  size="small"
                  :min="1"
                  :max="10"
                  :step="1"
                />
              </div>
              <div class="flex items-center justify-between gap-4">
                <label for="step">Step</label>
                <InputNumber
                  id="step"
                  v-model="gridStep"
                  suffix="%"
                  class="text-right"
                  size="small"
                  :min="1"
                  :max="100"
                  :step="1"
                />
              </div>
            </div>
            <div class="flex justify-end gap-4">
              <Button
                label="Close"
                severity="secondary"
                @click="visible = false"
              />
              <Button label="Save" @click="visible = false" />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  </div>
</template>
