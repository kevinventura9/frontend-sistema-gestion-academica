<template>
  <v-container>
    <v-card>
      <v-card-title>Consulta de Secciones</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="3">
            <v-select 
              v-model="filtros.anio" 
              :items="anios" 
              label="Año Lectivo" 
              clearable
              @update:modelValue="onFiltroChange"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select 
              v-model="filtros.grado" 
              :items="grados" 
              label="Grado" 
              clearable
              @update:modelValue="onFiltroChange"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select 
              v-model="filtros.codigo" 
              :items="['A', 'B']" 
              label="Código" 
              clearable
              @update:modelValue="onFiltroChange"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select 
              v-model="filtros.estado" 
              :items="estados" 
              label="Estado" 
              clearable
              @update:modelValue="onFiltroChange"
            />
          </v-col>
        </v-row>
        
        <!-- Mensaje cuando no hay filtros -->
        <v-alert
          v-if="!hayFiltrosSeleccionados"
          type="info"
          variant="tonal"
          class="mb-4"
        >
          Selecciona al menos un filtro (Año Lectivo, Grado, Código o Estado) para ver las secciones.
        </v-alert>
        
        <v-data-table
          v-else
          :headers="headers"
          :items="secciones"
          :loading="cargando"
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
        codigo: null
      },
      anios: Array.from({ length: 2040 - 2024 + 1 }, (_, i) => 2024 + i),
      estados: ['Abierta', 'Cerrada'],
      grados: ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Septimo', 'Octavo', 'Noveno', 'Primer año', 'Segundo año'],
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
  computed: {
    hayFiltrosSeleccionados() {
      return this.filtros.anio || this.filtros.grado || this.filtros.codigo || this.filtros.estado
    }
  },
  mounted() {
    // No cargar automáticamente - esperar a que seleccione filtros
  },
  methods: {
    onFiltroChange() {
      if (this.hayFiltrosSeleccionados) {
        this.consultarSecciones()
      } else {
        this.secciones = []
      }
    },
    consultarDetalle(id) {
      this.$router.push({ path: `/modulo2/consulta-secciones/detalle/${id}` })
    },
    async consultarSecciones() {
      this.cargando = true;
      try {
        const params = {};
        
        if (this.filtros.anio) params.anio_lectivo = this.filtros.anio;
        if (this.filtros.estado) params.estado = this.filtros.estado;
        if (this.filtros.grado) params.grado = this.filtros.grado;
        if (this.filtros.codigo) params.codigo = this.filtros.codigo;
        
        const response = await axios.get('/secciones', { params });
        
        // Ordenar por grado ascendente usando el orden completo
        const ordenGrados = ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Septimo', 'Octavo', 'Noveno', 'Primer año', 'Segundo año'];
        this.secciones = response.data.sort((a, b) => ordenGrados.indexOf(a.grado) - ordenGrados.indexOf(b.grado));
      } catch (error) {
        console.error('Error al consultar las secciones:', error);
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
