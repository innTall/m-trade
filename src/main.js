import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";
import { setupServiceWorker } from "./registerServiceWorker.js";
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
setupServiceWorker(); // Register the Service Worker

app.use(pinia).use(router).mount("#app");