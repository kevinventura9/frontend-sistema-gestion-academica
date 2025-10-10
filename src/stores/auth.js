import { login as apiLogin } from '@/api/autenticacion'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async login(email, password) {
      try {
        const response = await apiLogin(email, password)
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return response
      } catch (error) {
        console.log('Error completo:', error)
        
        // Procesar errores específicos de Laravel
        if (error.response && error.response.data) {
          const errorData = error.response.data
          console.log('Error data:', errorData)

          // Si hay errores de validación específicos
          if (errorData.errors) {
            throw {
              type: 'validation',
              errors: errorData.errors,
              message: errorData.message || 'Errores de validación'
            }
          }

          // Si es un error general (como credenciales incorrectas)
          if (errorData.message) {
            throw {
              type: 'general',
              message: errorData.message
            }
          }
        }

        // Error de red u otro tipo
        if (error.code === 'NETWORK_ERROR' || !error.response) {
          throw {
            type: 'network',
            message: 'Error de conexión. Verifica tu conexión a internet.'
          }
        }

        // Error desconocido
        throw {
          type: 'unknown',
          message: error.message || 'Error desconocido'
        }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        this.token = token
        this.user = JSON.parse(userData)
        this.isAuthenticated = true
      } else {
        // Si no hay token o datos de usuario, asegurar que no esté autenticado
        this.isAuthenticated = false
        this.user = null
        this.token = null
      }
    }
  }
})
