import {createApp} from "vue";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router/index.js";
import "./style.css";

// delete?
import { registerSW } from 'virtual:pwa-register'
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true) // activate new SW immediately
    window.location.reload() // reload app with new files
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

// ok
const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(pinia).use(router).mount("#app");
