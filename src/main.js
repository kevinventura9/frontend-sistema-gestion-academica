import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

import { useAuthStore } from '@/stores/auth'
import axios from 'axios'


// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'

// Create vue app
const app = createApp(App)

// Configurar axios con token
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Register plugins
registerPlugins(app)

// Inicializar autenticación
const authStore = useAuthStore()
authStore.initializeAuth()

// Mount vue app
app.mount('#app')
