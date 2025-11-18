<template>
  <div>
    <ListaSecciones @notify="onNotify" />

    <v-snackbar v-model="snackbar.show" :timeout="4000" top right>
      {{ snackbar.message }}
      <template #action>
        <v-btn text @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ListaSecciones from '@/views/modulo-calificaciones/ListaSecciones.vue';

export default {
  name: 'CalificacionesPage',
  components: { ListaSecciones },
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
