import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      const auth = useAuthStore();
      return auth.isAuthenticated ? '/feed' : '/login';
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/feed',
    name: 'feed',
    component: () => import('@/views/feed/FeedView.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/views/upload/UploadView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/clip/:id',
    name: 'clip',
    component: () => import('@/views/clip/ClipDetailView.vue'),
  },
  {
    path: '/athlete/:id',
    name: 'athlete',
    component: () => import('@/views/profile/AthleteProfileView.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'feed' };
  }
  return true;
});
