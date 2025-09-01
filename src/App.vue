<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Main content -->
    <RouterView />
    <!-- Persistent navbar -->
    <Navbar />
  </div>
</template>

<style scoped></style>
