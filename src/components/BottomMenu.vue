<script setup>
import { ref } from 'vue';
import { Button, ButtonGroup } from 'primevue';

// Define the buttons
const buttons = ref([
  { label: 'Home', icon: 'pi pi-home', action: () => navigateTo('home') },
  { label: 'Search', icon: 'pi pi-search', action: () => navigateTo('search') },
  {
    label: 'Notifications',
    icon: 'pi pi-bell',
    action: () => navigateTo('notifications'),
  },
  { label: 'Profile', icon: 'pi pi-user', action: () => navigateTo('profile') },
]);

// Navigation function
const navigateTo = route => {
  console.log(`Navigating to: ${route}`);
  // Add your navigation logic here (e.g., using Vue Router)
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
