<template>
  <div :key="$route.fullPath">
    <ConfiguracionPorcentajes @notify="onNotify" :key="componentKey" />

    <v-snackbar v-model="snackbar.show" :timeout="4000" :color="snackbar.color" top right>
      {{ snackbar.message }}
      <template #action>
        <v-btn text @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ConfiguracionPorcentajes from '@/views/modulo-calificaciones/ConfiguracionPorcentajes.vue';

export default {
  name: 'ConfiguracionPorcentajesPage',
  components: { ConfiguracionPorcentajes },
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
      this.snackbar.message = payload?.message || 'Operación completada'
      this.snackbar.color = payload?.color || 'info'
      this.snackbar.show = true
    }
  }
}
</script>
