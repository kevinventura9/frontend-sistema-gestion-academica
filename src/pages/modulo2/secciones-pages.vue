<template>
  <v-container>
    <FormularioSeccion
      @guardar-seccion="onGuardarSeccion"
      ref="formSeccion"
      :seccionEdit="seccionEdit"
      @reset-edit="seccionEdit = null"
    />
    <ListaSecciones
      ref="listaSecciones"
      @editar-seccion="onEditarSeccion"
    />
  </v-container>
</template>

<script>
import FormularioSeccion from '../../views/modulo2/FormularioSeccion.vue';
import ListaSecciones from '../../views/modulo2/ListaSecciones.vue';

export default {
  name: 'SeccionesPages',
  components: {
    FormularioSeccion,
    ListaSecciones
  },
  data() {
    return {
      seccionEdit: null
    }
  },
  methods: {
    onGuardarSeccion() {
      // Limpiar validación del formulario
      if (this.$refs.formSeccion) {
        this.$refs.formSeccion.resetValidation && this.$refs.formSeccion.resetValidation();
      }
      // Actualizar la lista de secciones
      if (this.$refs.listaSecciones) {
        this.$refs.listaSecciones.cargarSecciones && this.$refs.listaSecciones.cargarSecciones();
      }
      this.seccionEdit = null
    },
    onEditarSeccion(seccion) {
      this.seccionEdit = { ...seccion }
    }
  }
}
</script>

<style scoped>
/* Add your component styles here if needed */
</style>
