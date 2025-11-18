<template>
  <v-card>
    <v-card-title>
      Calificaciones - Secciones Disponibles
    </v-card-title>
    
    <!-- Filtros de búsqueda -->
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filtros.anio_lectivo"
            :items="aniosDisponibles"
            label="Año Lectivo"
            clearable
            @update:modelValue="cargarSecciones"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filtros.grado"
            :items="gradosDisponibles"
            label="Grado"
            clearable
            @update:modelValue="cargarSecciones"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filtros.codigo"
            :items="['A', 'B']"
            label="Código"
            clearable
            @update:modelValue="cargarSecciones"
          />
        </v-col>
      </v-row>
      
      <v-data-table
        :headers="headers"
        :items="secciones"
        :loading="loading"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item.acciones="{ item }">
          <v-btn
            color="primary"
            size="small"
            @click="revisarCalificaciones(item)"
          >
            Revisar
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { obtenerSecciones } from '@/apis/secciones';

export default {
  name: 'ListaSecciones',
  data() {
    return {
      secciones: [],
      loading: false,
      filtros: {
        anio_lectivo: null,
        grado: null,
        codigo: null
      },
      aniosDisponibles: Array.from({ length: 2040 - 2024 + 1 }, (_, i) => 2024 + i),
      gradosDisponibles: ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Septimo', 'Octavo', 'Noveno', 'Primer año', 'Segundo año'],
      headers: [
        { title: 'Grado', key: 'grado', sortable: true },
        { title: 'Código', key: 'codigo', sortable: true },
        { title: 'Año Lectivo', key: 'anio_lectivo', sortable: true },
        { title: 'Acciones', key: 'acciones', sortable: false }
      ]
    }
  },
  mounted() {
    this.cargarSecciones()
  },
  methods: {
    async cargarSecciones() {
      this.loading = true
      try {
        console.log('🔍 Cargando secciones con filtros:', this.filtros)
        
        const data = await obtenerSecciones()
        console.log('📦 Secciones recibidas:', data)
        
        // Aplicar filtros localmente
        let seccionesFiltradas = data.secciones || data || []
        
        if (this.filtros.anio_lectivo) {
          seccionesFiltradas = seccionesFiltradas.filter(
            s => s.anio_lectivo == this.filtros.anio_lectivo
          )
        }
        
        if (this.filtros.grado) {
          seccionesFiltradas = seccionesFiltradas.filter(
            s => s.grado === this.filtros.grado
          )
        }
        
        if (this.filtros.codigo) {
          seccionesFiltradas = seccionesFiltradas.filter(
            s => s.codigo === this.filtros.codigo
          )
        }
        
        this.secciones = seccionesFiltradas.map(item => ({
          id: item.id,
          grado: item.grado || '',
          codigo: item.codigo || '',
          anio_lectivo: item.anio_lectivo || ''
        }))
        
        console.log('📋 Secciones procesadas:', this.secciones)
      } catch (error) {
        console.error('❌ Error al obtener secciones:', error)
        console.error('Detalles del error:', error.response?.data)
        this.$emit('notify', {
          message: 'Error al cargar las secciones',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    revisarCalificaciones(item) {
      console.log('📝 Revisar calificaciones de sección:', item)
      // Navegar a la vista de calificaciones con el ID de la sección
      this.$router.push({
        name: 'calificaciones-detalle',
        params: { seccionId: item.id }
      })
    }
  }
}
</script>

<style scoped>
/* styles if needed */
</style>
