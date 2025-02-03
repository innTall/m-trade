<script setup>
import { ref } from 'vue';
import { Button, Dialog, Divider, InputNumber } from 'primevue';
import { storeToRefs } from 'pinia';
import { useMarginSettingsStore } from '@/stores/marginSettings.js';

const { deposit, leverage, coefRisk, coefTP, coefSL, coefExtra } = storeToRefs(
  useMarginSettingsStore()
);

const isOpen = ref(false);
const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

const submit = () => {
  close();
};
</script>

<template>
  <div>
    <Button
      @click="open"
      icon="pi pi-cog"
      aria-label="Cog"
      variant="text"
      severity="contrast"
    />
    <Dialog
      v-model:visible="isOpen"
      :modal="true"
      :closable="false"
      header="Settings"
    >
      <div class="space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-4">
            <label for="depo">Deposit</label>
            <InputNumber
              id="depo"
              v-model="deposit"
              mode="currency"
              currency="USD"
              class="text-right"
              size="small"
            />
          </div>
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
          <div class="flex justify-center text-sm">Coeficients</div>
          <Divider />
          <div class="flex items-center justify-between gap-4">
            <label for="mar">Risk</label>
            <InputNumber
              id="mar"
              v-model="coefRisk"
              suffix="%"
              class="text-right"
              size="small"
            />
          </div>
          <div class="flex items-center justify-between gap-4">
            <label for="tp">TP</label>
            <InputNumber
              id="tp"
              v-model="coefTP"
              suffix="%"
              class="text-right"
              size="small"
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
            />
          </div>
          <div class="flex items-center justify-between gap-4">
            <label for="cord">Margin</label>
            <InputNumber
              id="cord"
              v-model="coefExtra"
              suffix="%"
              class="text-right"
              size="small"
            />
          </div>
        </div>
        <div class="flex justify-end gap-4">
          <Button @click="close" label="Close" severity="secondary" />
          <Button @click="submit" label="Submit" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
<style scoped></style>
