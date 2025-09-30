import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

import { useAlertStore } from '@/stores/alertas'
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

// Configurar interceptor de respuesta después de montar la app
axios.interceptors.response.use(
  (response) => {
    // Agregar notificación de éxito cuando el status sea 201
    if (response.status === 201) {
      const alertStore = useAlertStore()
      alertStore.showAlert({
        type: 'success',
        message: 'Operación exitosa',
        timeout: 3000,
      })
    }
    return response
  },
  async (error) => {
    const alertStore = useAlertStore()
    let message = ''
    let type = 'error'

    // Intentar obtener el mensaje del JSON response
    const responseMessage = error.response?.data?.message || error.response?.data?.error

    if (!error.response || error.response.status === 0) {
      message = 'No se pudo establecer conexión con el servidor'
    } else if (error.response.status === 403) {
      message = responseMessage || 'No tienes permisos para realizar esta acción'
    } else if (error.response.status === 422) {
      message = responseMessage || 'Por favor verifica los datos ingresados'
    } else if (error.response.status === 500) {
      message = responseMessage || 'Error de servidor'
    } else if (error.response.status >= 400 && error.response.status < 500) {
      message = responseMessage || 'Por favor verifica los datos ingresados'
    }

    alertStore.showAlert({
      type: type,
      message: message,
      timeout: 3000,
    })

    return Promise.reject(error)
  }
)
