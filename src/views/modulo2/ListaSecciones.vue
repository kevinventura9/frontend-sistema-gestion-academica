<template>
  <v-card>
    <v-card-title>Lista de Secciones</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="secciones"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item.acciones="{ item }">
         <v-btn color="primary" @click="$emit('editar-seccion', item)">Editar</v-btn>
         <v-btn color="error" @click="eliminar(item.id)">Eliminar</v-btn>
         <v-btn color="secondary" @click="abrirClonar(item)">Clonar</v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { eliminarSeccion, obtenerSecciones } from '../../apis/secciones'

export default {
  name: 'ListaSecciones',
  data() {
    return {
      secciones: [],
      headers: [
        { text: 'Jornada', value: 'jornada' },
        { text: 'Código', value: 'codigo' },
        { text: 'Estado', value: 'estado' },
        { text: 'Grado', value: 'grado' },
        { text: 'Capacidad Máxima', value: 'capacidad_maxima' },
        { text: 'Plan de Estudio', value: 'plan_estudio_id' },
        { text: 'Año Lectivo', value: 'anio_lectivo' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ]
    }
  },
  mounted() {
    this.cargarSecciones()
  },
  methods: {
    async cargarSecciones() {
      try {
        this.secciones = await obtenerSecciones()
      } catch (error) {
        // Aquí puedes mostrar una alerta si lo deseas
      }
    },
    async eliminar(id) {
      try {
        await eliminarSeccion(id)
        alert('Sección eliminada exitosamente.')
        this.cargarSecciones()
      } catch (error) {
        alert('Error al eliminar la sección.')
      }
    },
    abrirClonar(item) {
      this.$emit('clonar-seccion', item)
    }
  }
}
</script>

