import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SearchActaView from '@/views/SearchActaView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/buscar-acta',
      name: 'buscar-acta',
      component: SearchActaView,
    },
  ],
});

export default router;
