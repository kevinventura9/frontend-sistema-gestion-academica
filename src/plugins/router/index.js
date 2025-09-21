import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isLoggedIn

  // Si la ruta requiere auth y no está autenticado, ir a login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // Si está en login y ya autenticado, ir a dashboard
  else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  }
  // De lo contrario, continuar
  else {
    next()
  }
})

export default function (app) {
  app.use(router)
}
export { router }
