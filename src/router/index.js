import { createRouter, createWebHistory } from 'vue-router';
import TradingPage from '../views/TradingPage.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/trading',
      name: 'trading',
      component: TradingPage,
    },
  ],
});

export default router;
