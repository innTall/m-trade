import { createRouter, createWebHistory } from 'vue-router';
import MarginTrade from '../views/MarginTrade.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'MarginTrade',
      component: MarginTrade,
    },
  ],
});

export default router;
