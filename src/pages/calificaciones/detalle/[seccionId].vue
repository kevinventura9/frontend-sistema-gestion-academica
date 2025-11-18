<template>
  <div>
    <DetalleCalificaciones 
      :seccionId="seccionId"
      @notify="onNotify" 
    />

    <v-snackbar v-model="snackbar.show" :timeout="4000" top right>
      {{ snackbar.message }}
      <template #action>
        <v-btn text @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import DetalleCalificaciones from '@/views/modulo-calificaciones/DetalleCalificaciones.vue';

export default {
  name: 'DetalleCalificacionesPage',
  components: { DetalleCalificaciones },
  computed: {
    seccionId() {
      return this.$route.params.seccionId
    }
  },
  data() {
    return {
      snackbar: {
        show: false,
        message: ''
      }
    }
  },
  methods: {
    onNotify(payload) {
      const msg = payload && payload.message 
        ? payload.message 
        : (payload && payload.success === false ? 'Ocurrió un error' : 'Operación exitosa')
      this.snackbar.message = msg
      this.snackbar.show = true
    }
  }
}
</script>

<style scoped>
/* page styles */
</style>
