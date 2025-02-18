<script setup>
import { ref } from 'vue';
import { Button, Dialog, Divider, InputNumber } from 'primevue';
import { storeToRefs } from 'pinia';
import { useMarginSettingsStore } from '@/stores/marginSettingsStore.js';

const { leverage, coefRisk, coefSL, coefExtra, gridSize, gridStep } =
  storeToRefs(useMarginSettingsStore());

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
          <Button @click="close" label="Close" severity="secondary" />
          <Button @click="submit" label="Submit" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
<style scoped></style>
