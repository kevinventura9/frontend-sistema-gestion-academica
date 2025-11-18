<template>
  <v-card>
    <v-card-title>
      Matrículas
      <v-spacer />
      <v-btn color="primary" @click="abrirDialog">Matricular</v-btn>
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
            @update:modelValue="cargarMatriculas"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filtros.grado"
            :items="gradosDisponibles"
            label="Grado"
            clearable
            @update:modelValue="cargarMatriculas"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filtros.codigo"
            :items="['A', 'B']"
            label="Código"
            clearable
            @update:modelValue="cargarMatriculas"
          />
        </v-col>
      </v-row>
      
      <!-- Mensaje cuando no hay filtros seleccionados -->
      <v-alert
        v-if="!filtros.anio_lectivo && !filtros.grado && !filtros.codigo"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        Selecciona al menos un filtro (Año Lectivo, Grado o Código) para ver las matrículas.
      </v-alert>
      
      <v-data-table
        :headers="headers"
        :items="matriculas"
        :loading="loading"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item.acciones="{ item }">
          <v-btn
            color="primary"
            size="small"
            class="me-2"
            @click="editarMatricula(item)"
          >
            Editar
          </v-btn>
          <v-btn
            color="error"
            size="small"
            @click="confirmarEliminacion(item)"
          >
            Eliminar
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>

    <FormularioMatricula
      v-model:open="dialog"
      @created="onCreated"
    />

    <!-- Formulario de edición -->
    <FormularioEdicionMatricula
      v-model:open="dialogEditar"
      :matricula="matriculaSeleccionada"
      @updated="onUpdated"
    />

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h6">¿Eliminar matrícula?</v-card-title>
        <v-card-text>
          <p v-if="matriculaSeleccionada">
            ¿Estás seguro de eliminar la matrícula de 
            <strong>{{ matriculaSeleccionada.alumno }}</strong>
            en <strong>{{ matriculaSeleccionada.grado }} {{ matriculaSeleccionada.codigo }}</strong>?
          </p>
          <p class="text-caption text-error mt-2">Esta acción no se puede deshacer.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn 
            color="error" 
            @click="eliminarMatricula"
            :loading="eliminando"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { eliminarMatricula, obtenerMatriculas } from '@/apis/matriculas';
import FormularioEdicionMatricula from './FormularioEdicionMatricula.vue';
import FormularioMatricula from './FormularioMatricula.vue';

export default {
  name: 'ListaMatriculas',
  components: { 
    FormularioMatricula,
    FormularioEdicionMatricula
  },
  data() {
    return {
      matriculas: [],
      dialog: false,
      dialogEditar: false,
      dialogEliminar: false,
      matriculaSeleccionada: null,
      loading: false,
      eliminando: false,
      filtros: {
        anio_lectivo: null,
        grado: null,
        codigo: null
      },
      aniosDisponibles: Array.from({ length: 2040 - 2024 + 1 }, (_, i) => 2024 + i),
      gradosDisponibles: ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Septimo', 'Octavo', 'Noveno', 'Primer año', 'Segundo año'],
      headers: [
        { title: 'Alumno', key: 'alumno', sortable: true },
        { title: 'Grado', key: 'grado', sortable: true },
        { title: 'Código', key: 'codigo', sortable: true },
        { title: 'Año Lectivo', key: 'anio_lectivo', sortable: true },
        { title: 'Acciones', key: 'acciones', sortable: false }
      ]
    }
  },
  mounted() {
    // No cargar matrículas automáticamente para optimizar recursos
    // Se cargarán cuando el usuario seleccione filtros
  },
  methods: {
    abrirDialog() {
      this.dialog = true
    },
    async cargarMatriculas() {
      // Solo cargar si hay al menos un filtro seleccionado
      const hayFiltros = this.filtros.anio_lectivo || this.filtros.grado || this.filtros.codigo
      
      if (!hayFiltros) {
        this.matriculas = []
        return
      }
      
      this.loading = true
      try {
        // Construir parámetros de filtro (solo los que tienen valor)
        const params = {}
        if (this.filtros.anio_lectivo) params.anio_lectivo = this.filtros.anio_lectivo
        if (this.filtros.grado) params.grado = this.filtros.grado
        if (this.filtros.codigo) params.codigo = this.filtros.codigo
        
        console.log('🔍 Cargando matrículas con filtros:', params)
        
        const data = await obtenerMatriculas(params)
        console.log('📦 Matrículas recibidas:', data)
        
        // Backend devuelve array con joins incluidos
        // Cada item tiene: id, alumno_id, seccion_id, alumno{nombre_completo}, seccion{grado, codigo, anio_lectivo}
        this.matriculas = (data || []).map(item => ({
          id: item.id,
          alumno: item.alumno?.nombre_completo || item.nombre_completo || '',
          grado: item.seccion?.grado || item.grado || '',
          codigo: item.seccion?.codigo || item.codigo || '',
          anio_lectivo: item.seccion?.anio_lectivo || item.anio_lectivo || ''
        }))
        
        console.log('📋 Matrículas procesadas:', this.matriculas)
      } catch (error) {
        console.error('❌ Error al obtener matriculas:', error)
        console.error('Detalles del error:', error.response?.data)
        this.$emit('notify', {
          message: 'Error al cargar las matrículas',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async onCreated(payload) {
      // payload may contain message, refresh list
      this.dialog = false
      await this.cargarMatriculas()
      this.$emit('notify', payload)
    },
    async onUpdated(payload) {
      this.dialogEditar = false
      this.matriculaSeleccionada = null
      await this.cargarMatriculas()
      this.$emit('notify', payload)
    },
    editarMatricula(item) {
      console.log('✏️ Editar matrícula:', item)
      this.matriculaSeleccionada = item
      this.dialogEditar = true
    },
    confirmarEliminacion(item) {
      console.log('📌 Matrícula seleccionada para eliminar:', item)
      this.matriculaSeleccionada = item
      this.dialogEliminar = true
    },
    async eliminarMatricula() {
      if (!this.matriculaSeleccionada) return
      
      this.eliminando = true
      try {
        console.log('🗑️ Eliminando matrícula ID:', this.matriculaSeleccionada.id)
        
        const response = await eliminarMatricula(this.matriculaSeleccionada.id)
        console.log('✅ Matrícula eliminada:', response)
        
        this.$emit('notify', {
          message: response.message || 'Matrícula eliminada correctamente',
          color: 'success'
        })
        
        this.dialogEliminar = false
        this.matriculaSeleccionada = null
        await this.cargarMatriculas()
      } catch (error) {
        console.error('❌ Error al eliminar matrícula:', error)
        const resp = error.response?.data
        let mensaje = 'Error al eliminar la matrícula'
        
        if (error.response?.status === 404) {
          mensaje = resp?.message || 'Matrícula no encontrada'
        } else if (resp?.message) {
          mensaje = resp.message
        }
        
        this.$emit('notify', {
          message: mensaje,
          color: 'error'
        })
      } finally {
        this.eliminando = false
      }
    }
  }
}
</script>

<style scoped>
/* styles if needed */
</style>
