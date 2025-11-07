<template>
  <v-container>
    <v-card>
      <v-card-title>Consulta de Secciones</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="3">
            <v-select v-model="filtros.anio" :items="anios" label="Año Lectivo" clearable />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select v-model="filtros.estado" :items="estados" label="Estado" clearable />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select v-model="filtros.grado" :items="grados" label="Grado" clearable />
          </v-col>
          <v-col cols="12" sm="3">
         <!-- Filtro de materia eliminado -->
          </v-col>
        </v-row>
        <v-btn color="primary" class="mb-4" @click="consultarSecciones">Buscar</v-btn>
        <v-data-table
          :headers="headers"
          :items="secciones"
          class="elevation-1"
        >
          <template v-slot:header.jornada>
            <span>Jornada</span>
          </template>
          <template v-slot:header.codigo>
            <span>Código</span>
          </template>
          <template v-slot:header.estado>
            <span>Estado</span>
          </template>
          <template v-slot:header.grado>
            <span>Grado</span>
          </template>
          <template v-slot:header.anio_lectivo>
            <span>Año Lectivo</span>
          </template>
          <template v-slot:header.acciones>
            <span>Acciones</span>
          </template>
          <template v-slot:item.acciones="{ item }">
            <v-btn color="info" @click="consultarDetalle(item.id)">Consultar</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'ConsultaSecciones',
  data() {
    return {
      filtros: {
        anio: null,
        estado: null,
        grado: null,
      },
        // Materia eliminada del filtro
    anios: Array.from({ length: 2040 - 2024 + 1 }, (_, i) => 2024 + i),
  estados: ['Abierta', 'Cerrada'],
    grados: ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Septimo', 'Octavo', 'Noveno', 'Primer año', 'Segundo año'],
      materias: [
        'Matemáticas', 'Ciencias', 'Artistica', 'Lenguaje', 'Sociales', 'Caligrafía', 'Educación Fisica'
      ],
      headers: [
        { text: 'Grado', value: 'grado' },
        { text: 'Código', value: 'codigo' },
        { text: 'Jornada', value: 'jornada' },
        { text: 'Estado', value: 'estado' },
        { text: 'Año Lectivo', value: 'anio_lectivo' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      secciones: [],
      cargando: false
    }
  },
  mounted() {
    this.consultarSecciones();
  },
  methods: {
    consultarDetalle(id) {
      this.$router.push({ path: `/modulo2/consulta-secciones/detalle/${id}` })
    },
    async consultarSecciones() {
      this.cargando = true;
      try {
        const params = {
          anio_lectivo: this.filtros.anio,
          estado: this.filtros.estado,
          grado: this.filtros.grado,
        };
         // Materia eliminada de los parámetros
        const response = await axios.get('http://localhost:8000/api/secciones', { params });
  // Ordenar por grado ascendente usando el orden completo
  const ordenGrados = ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Septimo', 'Octavo', 'Noveno', 'Primer año', 'Segundo año'];
  this.secciones = response.data.sort((a, b) => ordenGrados.indexOf(a.grado) - ordenGrados.indexOf(b.grado));
      } catch (error) {
        alert('Error al consultar las secciones');
        this.secciones = [];
      } finally {
        this.cargando = false;
      }
    }
  }
}
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>
