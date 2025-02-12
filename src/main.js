import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import App from './App.vue';
import router from './router/index.js';

import 'primeicons/primeicons.css';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .use(pinia)
  .use(router)
  .mount('#app');
