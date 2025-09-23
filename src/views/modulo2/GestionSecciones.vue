<template>
  <div>
    <ListaSecciones
      @clonar-seccion="onClonarSeccion"
    />
    <v-dialog v-model="modalClonar" max-width="600px">
      <FormularioSeccion
        v-if="seccionAClonar"
        :seccion="seccionAClonar"
        :modoClonar="true"
        @submit="clonarSeccion"
        @cancelar="modalClonar = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import FormularioSeccion from './FormularioSeccion.vue'
import ListaSecciones from './ListaSecciones.vue'

export default {
  name: 'GestionSecciones',
  components: {
    ListaSecciones,
    FormularioSeccion
  },
  data() {
    return {
      modalClonar: false,
      seccionAClonar: null
    }
  },
  methods: {
    onClonarSeccion(seccion) {
      // Copia los datos para evitar mutaciones directas
      this.seccionAClonar = { ...seccion }
      this.modalClonar = true
    },
    async clonarSeccion(datos) {
      try {
        await axios.post('http://localhost:8000/api/secciones/clonar', datos)
        this.$emit('refrescar-lista')
        this.modalClonar = false
        this.seccionAClonar = null
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
