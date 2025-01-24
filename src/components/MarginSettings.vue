<script setup>
import { Button, Dialog, Divider, InputNumber } from 'primevue';
import { storeToRefs } from 'pinia';
import { useMarginSettingsStore } from '@/stores/marginSettings.js';

const {
  openSettings,
  deposit,
  leverage,
  coefRisk,
  coefTP,
  coefSL,
  coefOrder,
  feeBuy,
  feeSell,
} = storeToRefs(useMarginSettingsStore());

const submitForm = (e) => {
  e.preventDefault();
  console.log('Form Submitted');
};
</script>

<template>
  <div>
    <Button
      @click="openSettings = true"
      icon="pi pi-cog"
      aria-label="Cog"
      variant="text"
      severity="secondary"
    />
    <Dialog
      v-model:visible="openSettings"
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
            <label for="cord">Order</label>
            <InputNumber
              id="cord"
              v-model="coefOrder"
              suffix="%"
              class="text-right"
              size="small"
            />
          </div>
          <div class="flex justify-center text-sm">Fees</div>
          <Divider />
          <div class="flex items-center justify-between">
            <label for="fb">Buy</label>
            <InputNumber
              id="fb"
              v-model="feeBuy"
              suffix="%"
              class="text-right"
              size="small"
            />
          </div>
          <div class="flex items-center justify-between">
            <label for="fs">Sell</label>
            <InputNumber
              id="fs"
              v-model="feeSell"
              suffix="%"
              class="text-right"
              size="small"
            />
          </div>
        </div>
        <div class="flex justify-end gap-4">
          <Button
            @click="openSettings = false"
            label="Close"
            severity="secondary"
          />
          <Button @click="handleSubmit" label="Submit" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
<style scoped></style>
