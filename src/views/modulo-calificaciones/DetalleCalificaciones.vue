<template>
  <v-card>
    <v-card-title>
      <v-btn
        icon
        size="small"
        @click="volver"
        class="me-2"
      >
        <v-icon>ri-arrow-left-line</v-icon>
      </v-btn>
      Calificaciones - {{ seccionInfo }}
    </v-card-title>
    
    <v-card-text>
      <v-alert
        v-if="!seccionId"
        type="warning"
        class="mb-4"
      >
        No se especificó una sección válida
      </v-alert>

      <template v-else>
        <!-- Información de la sección -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-text>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <p class="text-subtitle-2 mb-1">Sección</p>
                    <p class="text-h6">{{ seccionInfo }}</p>
                  </div>
                  <v-btn
                    color="primary"
                    @click="abrirDialogNuevaCalificacion"
                  >
                    <v-icon start>ri-add-line</v-icon>
                    Nueva Calificación
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filtros de búsqueda -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="busqueda"
              label="Buscar alumno"
              placeholder="Escribe nombre o apellido..."
              prepend-inner-icon="ri-search-line"
              clearable
              @update:modelValue="buscarYFiltrar"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="filtroMateria"
              :items="materiasDisponibles"
              label="Filtrar por Materia"
              clearable
              @update:modelValue="aplicarFiltros"
            />
          </v-col>
        </v-row>

        <!-- Tabla de calificaciones -->
        <v-data-table
          :headers="headers"
          :items="calificacionesFiltradas"
          :loading="loading"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.acciones="{ item }">
            <v-btn
              color="primary"
              size="small"
              class="me-2"
              @click="editarCalificacion(item)"
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
      </template>
    </v-card-text>

    <!-- Diálogo para crear/editar calificación -->
    <v-dialog v-model="dialogCalificacion" max-width="600">
      <v-card>
        <v-card-title>
          {{ modoEdicion ? 'Editar Calificación' : 'Nueva Calificación' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="formCalificacion.alumno"
                  :items="alumnosMatriculados"
                  item-title="nombre_completo"
                  item-value="nombre_completo"
                  label="Alumno *"
                  :readonly="modoEdicion"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formCalificacion.asignatura"
                  :items="materiasDisponibles"
                  label="Asignatura *"
                  :readonly="modoEdicion"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formCalificacion.parcial"
                  :items="parciales"
                  label="Parcial"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="formCalificacion.nota"
                  label="Nota"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogCalificacion = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            @click="guardarCalificacion"
            :loading="guardando"
          >
            {{ modoEdicion ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h6">¿Eliminar calificación?</v-card-title>
        <v-card-text>
          <p v-if="calificacionSeleccionada">
            ¿Estás seguro de eliminar la calificación de 
            <strong>{{ calificacionSeleccionada.alumno }}</strong>
            en <strong>{{ calificacionSeleccionada.asignatura }}</strong>
            ({{ calificacionSeleccionada.parcial }})?
          </p>
          <p class="text-caption text-error mt-2">Esta acción no se puede deshacer.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn 
            color="error" 
            @click="eliminarCalificacionConfirmada"
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
import {
  actualizarCalificacion,
  buscarAlumnosMatriculados,
  crearCalificacion,
  eliminarCalificacion
} from '@/apis/calificaciones';
import { obtenerMaterias } from '@/apis/materias';

export default {
  name: 'DetalleCalificaciones',
  props: {
    seccionId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      calificaciones: [],
      calificacionesFiltradas: [],
      alumnosMatriculados: [],
      loading: false,
      dialogCalificacion: false,
      dialogEliminar: false,
      modoEdicion: false,
      guardando: false,
      eliminando: false,
      calificacionSeleccionada: null,
      seccionInfo: '',
      busqueda: '',
      filtroMateria: null,
      materiasDisponibles: [],
      busquedaTimeout: null,
      formCalificacion: {
        alumno: '',
        asignatura: '',
        parcial: null,
        nota: null
      },
      parciales: ['Primer Parcial', 'Segundo Parcial', 'Tercer Parcial', 'Cuarto Parcial'],
      headers: [
        { title: 'Alumno', key: 'alumno', sortable: true },
        { title: 'Asignatura', key: 'asignatura', sortable: true },
        { title: 'Parcial', key: 'parcial', sortable: true },
        { title: 'Nota', key: 'nota', sortable: true },
        { title: 'Acciones', key: 'acciones', sortable: false }
      ]
    }
  },
  mounted() {
    this.cargarCalificaciones()
    this.cargarAlumnosMatriculados()
    this.cargarMaterias()
  },
  methods: {
    async cargarCalificaciones() {
      if (!this.seccionId) return
      
      this.loading = true
      try {
        console.log('🔍 Cargando calificaciones para sección:', this.seccionId)
        
        // Por ahora iniciamos con array vacío hasta que conectes el backend
        this.calificaciones = []
        this.calificacionesFiltradas = []
        
        // Establecer información de la sección
        this.seccionInfo = `Sección #${this.seccionId}`
        
        console.log('📋 Vista preparada para mostrar calificaciones')
        
      } catch (error) {
        console.error('❌ Error al obtener calificaciones:', error)
        console.error('Detalles del error:', error.response?.data)
        this.$emit('notify', {
          message: 'Error al cargar las calificaciones',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async cargarAlumnosMatriculados() {
      if (!this.seccionId) return
      
      try {
        console.log('🔍 Cargando alumnos matriculados en sección:', this.seccionId)
        
        // Cargar todos los alumnos de la sección
        const data = await buscarAlumnosMatriculados(this.seccionId, '', 100)
        this.alumnosMatriculados = (data || []).map(item => ({
          id: item.id,
          nombre_completo: item.nombre_completo || item.alumno?.nombre_completo || ''
        }))
        
        console.log('📋 Alumnos matriculados:', this.alumnosMatriculados)
      } catch (error) {
        console.error('❌ Error al cargar alumnos matriculados:', error)
      }
    },
    async cargarMaterias() {
      try {
        console.log('🔍 Cargando materias desde la base de datos para sección:', this.seccionId)
        
        // Pasar seccion_id para que el backend filtre según el grado
        const data = await obtenerMaterias({ seccion_id: this.seccionId })
        this.materiasDisponibles = (data || []).map(m => m.nombre || m)
        
        console.log('📚 Materias cargadas:', this.materiasDisponibles)
      } catch (error) {
        console.error('❌ Error al cargar materias:', error)
        // Fallback: materias por defecto si falla
        this.materiasDisponibles = ['Matemáticas', 'Ciencias', 'Sociales', 'Lenguaje']
      }
    },
    buscarYFiltrar(query) {
      // Cancelar búsqueda anterior si existe
      if (this.busquedaTimeout) {
        clearTimeout(this.busquedaTimeout)
      }
      
      // Esperar 300ms antes de filtrar (debounce)
      this.busquedaTimeout = setTimeout(() => {
        this.aplicarFiltros()
      }, 300)
    },
    aplicarFiltros() {
      let resultados = [...this.calificaciones]
      
      // Filtrar por búsqueda de alumno
      if (this.busqueda && this.busqueda.trim().length > 0) {
        const busquedaLower = this.busqueda.toLowerCase()
        resultados = resultados.filter(c => 
          c.alumno.toLowerCase().includes(busquedaLower)
        )
      }
      
      // Filtrar por materia
      if (this.filtroMateria) {
        resultados = resultados.filter(c => c.asignatura === this.filtroMateria)
      }
      
      this.calificacionesFiltradas = resultados
      console.log('📋 Calificaciones filtradas:', this.calificacionesFiltradas)
    },
    volver() {
      this.$router.push({ name: 'calificaciones' })
    },
    abrirDialogNuevaCalificacion() {
      this.modoEdicion = false
      this.formCalificacion = {
        alumno: '',
        asignatura: '',
        parcial: null,
        nota: null
      }
      this.dialogCalificacion = true
    },
    editarCalificacion(item) {
      console.log('✏️ Editar calificación:', item)
      this.modoEdicion = true
      this.calificacionSeleccionada = item
      this.formCalificacion = {
        alumno: item.alumno,
        asignatura: item.asignatura,
        parcial: item.parcial,
        nota: item.nota
      }
      this.dialogCalificacion = true
    },
    async guardarCalificacion() {
      this.guardando = true
      try {
        if (this.modoEdicion) {
          // Actualizar calificación existente
          const payload = {
            parcial: this.formCalificacion.parcial,
            nota: this.formCalificacion.nota
          }
          
          const response = await actualizarCalificacion(
            this.calificacionSeleccionada.id, 
            payload
          )
          
          this.$emit('notify', {
            message: response.message || 'Calificación actualizada correctamente',
            color: 'success'
          })
        } else {
          // Crear nueva calificación
          const payload = {
            // Aquí necesitarías los IDs reales de matrícula y asignatura
            // Por ahora es un placeholder
            matricula_id: null,
            asignatura_id: null,
            parcial: this.formCalificacion.parcial,
            nota: this.formCalificacion.nota
          }
          
          const response = await crearCalificacion(payload)
          
          this.$emit('notify', {
            message: response.message || 'Calificación creada correctamente',
            color: 'success'
          })
        }
        
        this.dialogCalificacion = false
        await this.cargarCalificaciones()
      } catch (error) {
        console.error('❌ Error al guardar calificación:', error)
        this.$emit('notify', {
          message: error.response?.data?.message || 'Error al guardar la calificación',
          color: 'error'
        })
      } finally {
        this.guardando = false
      }
    },
    confirmarEliminacion(item) {
      console.log('📌 Calificación seleccionada para eliminar:', item)
      this.calificacionSeleccionada = item
      this.dialogEliminar = true
    },
    async eliminarCalificacionConfirmada() {
      if (!this.calificacionSeleccionada) return
      
      this.eliminando = true
      try {
        console.log('🗑️ Eliminando calificación ID:', this.calificacionSeleccionada.id)
        
        const response = await eliminarCalificacion(this.calificacionSeleccionada.id)
        console.log('✅ Calificación eliminada:', response)
        
        this.$emit('notify', {
          message: response.message || 'Calificación eliminada correctamente',
          color: 'success'
        })
        
        this.dialogEliminar = false
        this.calificacionSeleccionada = null
        await this.cargarCalificaciones()
      } catch (error) {
        console.error('❌ Error al eliminar calificación:', error)
        this.$emit('notify', {
          message: error.response?.data?.message || 'Error al eliminar la calificación',
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
