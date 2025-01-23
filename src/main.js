import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import Nora from '@primevue/themes/nora';

import App from './App.vue';
import router from './router/index.js';
import { setupServiceWorker } from './registerServiceWorker.js';

import './style.css';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

setupServiceWorker(); // Register the Service Worker

app
  .use(PrimeVue, {
    theme: {
      preset: Nora,
    },
  })
  .use(pinia)
  .use(router)
  .mount('#app');
