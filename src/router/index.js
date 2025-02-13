import { createRouter, createWebHistory } from 'vue-router';
import TradingPage from '../views/TradingPage.vue';
import OrdersPage from '../views/OrdersPage.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/trading',
      name: 'trading',
      component: TradingPage,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersPage,
    },
  ],
});

export default router;
