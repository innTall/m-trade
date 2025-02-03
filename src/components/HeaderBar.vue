<script setup>
import { storeToRefs } from 'pinia';
import SelectQuoteAsset from './SelectQuoteAsset.vue';
import { useAccountStore } from '../stores/accountStore';

const accountStore = useAccountStore();
const { balance } = storeToRefs(accountStore);
</script>

<template>
  <div class="flex items-center justify-between p-1">
    <!-- <div>
      <img src="/pwa-64x64.png" alt="Logo" width="32" />
    </div> -->
    <div>
      Balance: <span class="font-bold">${{ balance }}</span>
    </div>
    <div>Market: <SelectQuoteAsset /></div>
  </div>
</template>
<style scoped></style>
