import { createRouter, createWebHistory } from 'vue-router';
import LongData from '../views/LongData.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LongData',
      component: LongData,
    },
    {
      path: '/shortData',
      name: 'ShortData',
      component: () => import('../views/ShortData.vue'),
    },
    {
      path: '/testPage',
      name: 'TestPage',
      component: () => import('../views/TestPage.vue'),
    },
  ],
});

export default router;
