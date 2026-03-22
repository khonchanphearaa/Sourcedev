import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/',           component: () => import('@/views/pages/HomeView.vue') },
    { path: '/article/:slug', component: () => import('@/views/pages/ArticleView.vue') },
    { path: '/login',      component: () => import('@/views/auth/LoginView.vue'),     meta: { guestOnly: true } },
    { path: '/register',   component: () => import('@/views/auth/RegisterView.vue'),  meta: { guestOnly: true } },
    { path: '/dashboard',  component: () => import('@/views/dashboard/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/write',      component: () => import('@/views/pages/EditorView.vue'),    meta: { requiresAuth: true } },
    { path: '/edit/:id',   component: () => import('@/views/pages/EditorView.vue'),    meta: { requiresAuth: true } },
    { path: '/profile',    component: () => import('@/views/auth/ProfileView.vue'),   meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFoundView.vue') },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.token && !auth.user) await auth.fetchMe()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.guestOnly  && auth.isAuthenticated)    return '/dashboard'
});

export default router