<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Button, Dialog, InputNumber, Divider } from 'primevue';
import { useInstrumentInfoStore } from '@/stores/instrumentInfoStore';
import { useOrdersStore } from '@/stores/ordersStore';
import ByBit from '@/api/bybit';
import { useToast } from 'primevue/usetoast';

// ----------------------------
// Services
// ----------------------------
const toast = useToast();

const instrumentInfoStore = useInstrumentInfoStore();
const ordersStore = useOrdersStore();
const { selectedSymbol } = storeToRefs(instrumentInfoStore);
const { orders } = storeToRefs(ordersStore);

const position = ref('center');
const visible = ref(false);

const selectedSymbolOrders = computed(() => {
  console.log(selectedSymbol.value.symbol);
  if (!selectedSymbol.value) return [];
  return orders.value.filter(
    order => order.symbol === selectedSymbol.value.symbol
  );
});

const showSuccess = () => {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Order canceled',
    life: 3000,
  });
};

const showError = () => {
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: 'Order is not canceled',
    life: 3000,
  });
};

const cancelOrder = async orderId => {
  const isCanceled = await ByBit.cancelOrder(orderId);
  if (!isCanceled) showError();
  showSuccess();
  await ordersStore.fetchOrders();
};

const cancellAllOrders = async () => {
  const isCanceled = await ByBit.cancelAllOrders(selectedSymbol.value.symbol);
  if (!isCanceled) return showError();
  showSuccess();
  await ordersStore.fetchOrders();
};

const openPosition = pos => {
  position.value = pos;
  visible.value = true;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center p-2">
      <div>
        <h2 class="text-xl font-bold">Orders</h2>
      </div>
      <div>
        <Button
          label="Cancel All"
          icon="pi pi-times"
          variant="text"
          severity="danger"
          @click="cancellAllOrders"
        />
      </div>
    </div>
    <div v-if="selectedSymbolOrders.length === 0" class="p-2">
      <p class="text-center">
        There is no open orders for {{ selectedSymbol.symbol }}
      </p>
    </div>
    <div
      v-else
      v-for="(order, index) in selectedSymbolOrders"
      :key="index"
      class="p-2 border border-sm rounded-lg m-2"
    >
      <div class="flex items-center">
        <div class="flex-grow">
          <div class="flex justify-between">
            <div class="px-2">
              {{ order.side }} {{ order.orderType }} ({{ order.orderStatus }})
            </div>
            <div class="px-2">
              Price:
              {{ order.price === '0' ? order.triggerPrice : order.price }}
            </div>
          </div>

          <div class="flex justify-between">
            <div class="px-2">Qty: {{ order.qty }}</div>

            <div class="px-2">
              TP/SL: {{ order.takeProfit || '-' }}/{{ order.stopLoss || '-' }}
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <Divider></Divider>
      <div class="flex justify-end gap-4">
        <Button
          label="Cancel"
          aria-label="Cancel"
          severity="secondary"
          outlined
          @click="cancelOrder({ symbol: order.symbol, orderId: order.orderId })"
          size="small"
        />
        <Button
          label="Modify"
          aria-label="Modify"
          @click="openPosition('bottom')"
          size="small"
        />
      </div>
    </div>
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
          <Button label="Close" severity="secondary" @click="visible = false" />
          <Button label="Save" @click="visible = false" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
