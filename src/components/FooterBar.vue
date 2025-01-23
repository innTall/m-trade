<script setup>
const appVersion = __APP_VERSION__;
</script>

<template>
  <div class="flex justify-between pt-2 text-sm border-t border-green-600">
    <div class="text-green-600">v.{{ appVersion }}</div>
    <div class="flex gap-2">
      <!-- Total Balance -->
      <div class="">Balance:</div>
      <!--span :class="getTotalBalanceColor" class="">{{ totalBalance.toFixed(2) }}</span-->
    </div>
  </div>
</template>
<style scoped></style>
