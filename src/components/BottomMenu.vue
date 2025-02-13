<script setup>
import { ref } from 'vue';
import { Button, ButtonGroup } from 'primevue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Define the buttons
const buttons = ref([
  { label: 'Home', icon: 'pi pi-home', action: () => navigateTo('') },
  {
    label: 'Trading',
    icon: 'pi pi-chart-line',
    action: () => navigateTo('trading'),
  },
  {
    label: 'Orders',
    icon: 'pi pi-shopping-cart',
    action: () => navigateTo('orders'),
  },
  { label: 'Profile', icon: 'pi pi-user', action: () => navigateTo('profile') },
]);

// Navigation function
const navigateTo = route => {
  console.log(`Navigating to: ${route}`);
  router.push({ name: route });
};
</script>

<template>
  <ButtonGroup>
    <Button
      v-for="(button, index) in buttons"
      :key="index"
      :icon="button.icon"
      class="flex-1 !rounded-none"
      @click="button.action"
      size="small"
      severity="secondary"
    />
  </ButtonGroup>
</template>
