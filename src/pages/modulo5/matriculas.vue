<template>
  <div>
    <ListaMatriculas ref="lista" @notify="onNotify" />

    <v-snackbar v-model="snackbar.show" :timeout="4000" top right>
      {{ snackbar.message }}
      <template #action>
        <v-btn text @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ListaMatriculas from '@/views/modulo5-matricula/ListaMatriculas.vue'

export default {
  name: 'MatriculasPage',
  components: { ListaMatriculas },
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
      // payload expected to have message and/or success
      const msg = payload && payload.message ? payload.message : (payload && payload.success === false ? 'Ocurrió un error' : 'Operación exitosa')
      this.snackbar.message = msg
      this.snackbar.show = true
    }
  }
}
</script>

<style scoped>
/* page styles */
</style>
