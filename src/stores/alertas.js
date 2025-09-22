import { defineStore } from 'pinia'

export const useAlertStore = defineStore('utils', {
  state: () => ({
    alert: {
      show: false,
      type: 'success',
      message: '',
      timeout: 3000,
      color: '#4CAF50',
    },
  }),
  actions: {
    showAlert(props = {}){
      let color = '#4CAF50' // Verde para success
      switch (props.type) {
        case 'info':
          color = '#2196F3' // Azul para info
          break
        case 'success':
          color = '#4CAF50' // Verde para success
          break
        case 'warning':
          color = '#FF9800' // Naranja para warning
          break
        case 'error':
          color = '#F44336' // Rojo para error
          break
        default:
          color = '#2196F3' // Azul por defecto
          break
      }
      const alert = {
        show: true,
        type: props.type ? props.type : 'success',
        message: props.message ? props.message : '',
        timeout: props.timeout ? props.timeout  : 3000,
        color: color,
      }

      this.alert = alert
    }
  },
})
