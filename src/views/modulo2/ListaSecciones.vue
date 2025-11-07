<template>
  <v-card>
    <v-card-title>Lista de Secciones</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="secciones"
        item-key="id"
        class="elevation-1"
        id="tabla-secciones"
      >
        <template v-slot:header.grado>
          <span>Grado</span>
        </template>
        <template v-slot:header.codigo>
          <span>Código</span>
        </template>
        <template v-slot:header.jornada>
          <span>Jornada</span>
        </template>
        <template v-slot:header.anio_lectivo>
          <span>Año Lectivo</span>
        </template>
        <template v-slot:header.estado>
          <span>Estado</span>
        </template>
        <template v-slot:header.acciones>
          <span>Acciones</span>
        </template>
        <template v-slot:item.acciones="{ item }">
          <div style="display: flex; gap: 8px;">
            <v-btn color="primary" @click="$emit('editar-seccion', item)">Editar</v-btn>
            <v-btn color="secondary" @click="abrirClonar(item)">Clonar</v-btn>
            <v-btn color="error" @click="eliminar(item.id)">Eliminar</v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { eliminarSeccion, obtenerSecciones } from '../../apis/secciones';
export default {
  name: 'ListaSecciones',
  data() {
    return {
      secciones: [],
      headers: [
        { text: 'Grado', value: 'grado' },
        { text: 'Código', value: 'codigo' },
        { text: 'Jornada', value: 'jornada' },
        { text: 'Estado', value: 'estado' },
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
        // Aquí puedes mostrar una alerta 
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
