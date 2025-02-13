<script setup>
import { storeToRefs } from 'pinia';
import { useAccountStore } from '../stores/accountStore';

const accountStore = useAccountStore();
const { balance } = storeToRefs(accountStore);
</script>

<template>
  <div class="flex items-center justify-between p-2">
    <div>
      <i class="pi pi-dollar"></i>
      <span>{{ balance.split('.')[0] }}</span>
    </div>
  </div>
</template>
<style scoped></style>
