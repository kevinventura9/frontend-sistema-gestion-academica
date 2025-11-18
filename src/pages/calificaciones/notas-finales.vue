<template>
  <div :key="$route.fullPath">
    <NotasFinales @notify="onNotify" :key="componentKey" />

    <v-snackbar 
      v-model="snackbar.show" 
      :timeout="4000" 
      :color="snackbar.color" 
      location="top right"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn 
          variant="text"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import NotasFinales from '@/views/modulo-calificaciones/NotasFinales.vue';

export default {
  name: 'NotasFinalesPage',
  components: { NotasFinales },
  data() {
    return {
      componentKey: 0,
      snackbar: {
        show: false,
        message: '',
        color: 'info'
      }
    }
  },
  watch: {
    '$route'() {
      this.componentKey++
    }
  },
  methods: {
    onNotify(payload) {
      try {
        this.snackbar.message = payload?.message || 'Operación completada'
        this.snackbar.color = payload?.color || 'info'
        this.snackbar.show = true
      } catch (error) {
        console.error('Error en onNotify:', error)
      }
    }
  }
}
</script>
