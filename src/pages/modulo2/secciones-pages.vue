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
      @clonar-seccion="onClonarSeccion"
    />
    <v-dialog v-model="modalClonar" max-width="600px">
      <FormularioSeccion
        v-if="seccionAClonar"
        :seccionEdit="seccionAClonar"
        :modoClonar="true"
        @submit="clonarSeccion"
        @cancelar="modalClonar = false"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
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
      seccionEdit: null,
      modalClonar: false,
      seccionAClonar: null
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
    },
    onClonarSeccion(seccion) {
      this.seccionAClonar = { ...seccion }
      this.modalClonar = true
    },
    async clonarSeccion(datos) {
      try {
        await axios.post('/secciones/clonar', datos)
        this.modalClonar = false
        this.seccionAClonar = null
        if (this.$refs.listaSecciones) {
          this.$refs.listaSecciones.cargarSecciones && this.$refs.listaSecciones.cargarSecciones();
        }
        this.$nextTick(() => {
          alert('Sección clonada exitosamente.')
        })
      } catch (error) {
        alert('Error al clonar la sección.')
      }
    }
  }
}
</script>

<style scoped>
/* Add your component styles here if needed */
</style>
