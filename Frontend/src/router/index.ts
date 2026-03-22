import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import VerifyOtp from '@/views/auth/VerifyOtp.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: () => import('@/views/pages/HomeView.vue') },
    { path: '/article/:slug', component: () => import('@/views/pages/ArticleView.vue') },
    { path: '/login', component: () => import('@/views/auth/LoginView.vue'), meta: { guestOnly: true } },
    { path: '/register', component: () => import('@/views/auth/RegisterView.vue'), meta: { guestOnly: true } },
    { path: '/forgot-password', component: () => import('@/views/auth/SendOTPView.vue'), meta: { guestOnly: true } },
    { path: '/dashboard', component: () => import('@/views/dashboard/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/admin/users', component: () => import('@/views/dashboard/AdminUsersView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/write', component: () => import('@/views/pages/EditorView.vue'), meta: { requiresAuth: true, requiresAdmin: false } },
    { path: '/edit/:id', component: () => import('@/views/pages/EditorView.vue'), meta: { requiresAuth: true } },
    { path: '/profile', component: () => import('@/views/auth/ProfileView.vue'), meta: { requiresAuth: true } },
    { path: '/aboutMe', component: () => import('@/views/pages/AboutUs.vue'), meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFoundView.vue') },
    {path : '/verifyOtp', name: 'verifyOtp', component: VerifyOtp},
    {path : '/reset-password', name: 'reset-password', component: ResetPassword},
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.token && !auth.user) await auth.fetchMe()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.guestOnly  && auth.isAuthenticated)    return '/dashboard'
  if (to.meta.requiresAdmin && auth.user?.role !== 'admin') return '/dashboard'
})
<<<<<<< HEAD
=======

>>>>>>> cb1933339a36b0322dd9a25f36084524091c3dc4

export default router