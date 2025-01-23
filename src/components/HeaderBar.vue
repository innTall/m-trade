<script setup>
import LogoItem from './layouts/LogoItem.vue';
</script>

<template>
  <div class="flex justify-between border-b border-green-600 pb-2">
    <div>
      <LogoItem />
    </div>
    <div class="flex justify-between text-sm">
      <div class="text-center">
        <div class="">Bybit</div>
        <RouterLink :to="{ name: 'MarginTrade' }" v-slot="{ isActive }">
          <span
            :class="[isActive ? 'text-blue-500 font-bold' : 'text-gray-500']"
          >
            Margin
          </span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
