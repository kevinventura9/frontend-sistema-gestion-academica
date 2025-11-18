<template>
  <v-card>
    <v-card-title>Calificar Actividades</v-card-title>
    
    <v-card-text>
      <!-- Filtros de Sección -->
      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <v-select
            v-model="filtros.anio_lectivo"
            :items="aniosDisponibles"
            label="Año Lectivo"
            clearable
            @update:modelValue="onFiltroChange"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filtros.grado"
            :items="gradosDisponibles"
            label="Grado"
            clearable
            @update:modelValue="onFiltroChange"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filtros.codigo"
            :items="['A', 'B']"
            label="Código"
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
        Selecciona al menos un filtro (Año Lectivo, Grado o Código) para ver las actividades disponibles.
      </v-alert>

      <template v-else>
        <!-- Selección de Materia, Trimestre y Actividad -->
        <v-row class="mb-4">
          <v-col cols="12" sm="4">
            <v-select
              v-model="materiaSeleccionada"
              :items="materias"
              item-title="nombre"
              item-value="id"
              label="Seleccionar Materia"
              return-object
              :loading="loadingMaterias"
              clearable
              @update:modelValue="onMateriaChange"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="trimestreSeleccionado"
              :items="trimestres"
              item-title="text"
              item-value="value"
              label="Trimestre"
              clearable
              :disabled="!materiaSeleccionada"
              @update:modelValue="onTrimestreChange"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="actividadSeleccionada"
              :items="actividadesFiltradas"
              item-title="nombre_completo"
              item-value="id"
              label="Seleccionar Actividad"
              return-object
              :loading="loadingActividades"
              :disabled="!materiaSeleccionada"
              @update:modelValue="cargarAlumnos"
            >
              <template v-slot:prepend-item v-if="!materiaSeleccionada">
                <v-list-item disabled>
                  <v-list-item-title class="text-caption text-grey">
                    Primero selecciona una materia
                  </v-list-item-title>
                </v-list-item>
                <v-divider />
              </template>
            </v-select>
          </v-col>
        </v-row>
        
        <!-- Info de actividad -->
        <v-row class="mb-4" v-if="actividadSeleccionada">
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-text class="py-2">
                <div class="d-flex justify-space-between">
                  <span><strong>Tipo:</strong> {{ actividadSeleccionada.tipo }}</span>
                  <span><strong>Valor Máx:</strong> {{ actividadSeleccionada.valor_maximo }} pts</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <template v-if="actividadSeleccionada">
          <!-- Búsqueda de alumnos -->
          <v-row class="mb-4">
            <v-col cols="12">
              <v-text-field
                v-model="busqueda"
                label="Buscar alumno"
                placeholder="Escribe nombre o apellido..."
                prepend-inner-icon="ri-search-line"
                clearable
                @update:modelValue="buscarAlumno"
              />
            </v-col>
          </v-row>

          <!-- Tabla de alumnos con calificaciones -->
          <v-data-table
            :headers="headers"
            :items="alumnosFiltrados"
            :loading="loading"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:item.nota="{ item }">
              <v-chip
                :color="item.calificado ? 'success' : 'grey'"
                size="small"
              >
                {{ item.nota_obtenida !== null ? item.nota_obtenida : 'Sin calificar' }}
              </v-chip>
            </template>
            <template v-slot:item.acciones="{ item }">
              <v-btn
                :color="item.calificado ? 'primary' : 'success'"
                size="small"
                @click="abrirDialogCalificar(item)"
              >
                {{ item.calificado ? 'Editar' : 'Calificar' }}
              </v-btn>
            </template>
          </v-data-table>
        </template>

        <v-alert v-else-if="!materiaSeleccionada" type="info" variant="tonal" class="mt-4">
          Selecciona una materia para ver las actividades disponibles.
        </v-alert>
        <v-alert v-else type="info" variant="tonal" class="mt-4">
          Selecciona una actividad para comenzar a calificar.
        </v-alert>
      </template>
    </v-card-text>

    <!-- Diálogo para calificar -->
    <v-dialog v-model="dialogCalificar" max-width="500">
      <v-card>
        <v-card-title>
          {{ alumnoCalificando?.calificado ? 'Editar' : 'Asignar' }} Calificación
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :model-value="alumnoCalificando?.nombre_completo"
                  label="Alumno"
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :model-value="actividadSeleccionada?.nombre"
                  label="Actividad"
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="formCalificacion.nota_obtenida"
                  label="Nota Obtenida"
                  type="number"
                  :min="0"
                  :max="actividadSeleccionada?.valor_maximo"
                  step="0.1"
                  :hint="`Máximo: ${actividadSeleccionada?.valor_maximo} puntos`"
                  persistent-hint
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formCalificacion.fecha_calificacion"
                  label="Fecha de Calificación"
                  type="date"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formCalificacion.observaciones"
                  label="Observaciones"
                  rows="2"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogCalificar = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            @click="guardarCalificacion"
            :loading="guardando"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { 
  obtenerActividades,
  asignarCalificacionActividad,
  obtenerCalificacionesActividades,
  buscarAlumnosMatriculados
} from '@/apis/calificaciones';
import { obtenerSecciones } from '@/apis/secciones';
import { obtenerMaterias } from '@/apis/materias';

export default {
  name: 'CalificarActividades',
  data() {
    return {
      filtros: {
        anio_lectivo: null,
        grado: null,
        codigo: null
      },
      seccionSeleccionada: null,
      materiaSeleccionada: null,
      trimestreSeleccionado: null,
      actividadSeleccionada: null,
      materias: [],
      actividades: [],
      alumnos: [],
      alumnosFiltrados: [],
      alumnoCalificando: null,
      busqueda: '',
      loading: false,
      loadingMaterias: false,
      loadingActividades: false,
      dialogCalificar: false,
      guardando: false,
      busquedaTimeout: null,
      aniosDisponibles: Array.from({ length: 2040 - 2024 + 1 }, (_, i) => 2024 + i),
      gradosDisponibles: ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Septimo', 'Octavo', 'Noveno', 'Primer año', 'Segundo año'],
      trimestres: [
        { value: 1, text: '1er Trimestre (Ene-Abr)' },
        { value: 2, text: '2do Trimestre (May-Jul)' },
        { value: 3, text: '3er Trimestre (Ago-Oct)' }
      ],
      formCalificacion: {
        nota_obtenida: null,
        fecha_calificacion: new Date().toISOString().split('T')[0],
        observaciones: ''
      },
      headers: [
        { title: 'Alumno', key: 'nombre_completo', sortable: true },
        { title: 'Nota', key: 'nota', sortable: true },
        { title: 'Observaciones', key: 'observaciones', sortable: false },
        { title: 'Acciones', key: 'acciones', sortable: false }
      ]
    }
  },
  computed: {
    hayFiltrosSeleccionados() {
      return this.filtros.anio_lectivo || this.filtros.grado || this.filtros.codigo
    },
    actividadesFiltradas() {
      if (!this.materiaSeleccionada) {
        return []
      }
      let actividades = this.actividades.filter(act => act.materia_id === this.materiaSeleccionada.id)
      
      // Filtrar por trimestre si está seleccionado
      if (this.trimestreSeleccionado) {
        actividades = actividades.filter(act => act.trimestre === this.trimestreSeleccionado)
      }
      
      return actividades
    }
  },
  mounted() {
    // No cargar nada automáticamente - esperar a que seleccione filtros
    // Si viene de otra vista con parámetros de ruta, aplicarlos
    this.aplicarFiltrosDeRuta()
  },
  methods: {
    aplicarFiltrosDeRuta() {
      const query = this.$route.query
      if (query.anio_lectivo) this.filtros.anio_lectivo = parseInt(query.anio_lectivo)
      if (query.grado) this.filtros.grado = query.grado
      if (query.codigo) this.filtros.codigo = query.codigo
      
      if (this.hayFiltrosSeleccionados) {
        this.cargarSeccionYActividades()
      }
    },
    async onFiltroChange() {
      // Limpiar selecciones al cambiar filtros
      this.materiaSeleccionada = null
      this.trimestreSeleccionado = null
      this.actividadSeleccionada = null
      this.alumnos = []
      this.alumnosFiltrados = []
      
      if (this.hayFiltrosSeleccionados) {
        await this.cargarSeccionYActividades()
      } else {
        this.materias = []
        this.actividades = []
      }
    },
    onMateriaChange() {
      // Limpiar trimestre y actividad al cambiar de materia
      this.trimestreSeleccionado = null
      this.actividadSeleccionada = null
      this.alumnos = []
      this.alumnosFiltrados = []
    },
    onTrimestreChange() {
      // Limpiar actividad al cambiar de trimestre
      this.actividadSeleccionada = null
      this.alumnos = []
      this.alumnosFiltrados = []
    },
    async cargarSeccionYActividades() {
      try {
        // Primero buscar la sección que coincida con los filtros
        const params = {}
        if (this.filtros.anio_lectivo) params.anio_lectivo = this.filtros.anio_lectivo
        if (this.filtros.grado) params.grado = this.filtros.grado
        if (this.filtros.codigo) params.codigo = this.filtros.codigo
        
        const secciones = await obtenerSecciones(params)
        const seccionesArray = secciones.secciones || secciones || []
        
        if (seccionesArray.length > 0) {
          this.seccionSeleccionada = seccionesArray[0]
          await this.cargarMaterias()
          await this.cargarActividades()
        } else {
          this.materias = []
          this.actividades = []
          this.$emit('notify', {
            message: 'No se encontró ninguna sección con esos filtros',
            color: 'warning'
          })
        }
      } catch (error) {
        console.error('Error al cargar sección:', error)
        this.$emit('notify', {
          message: 'Error al buscar la sección',
          color: 'error'
        })
      }
    },
    async cargarMaterias() {
      if (!this.seccionSeleccionada) {
        console.error('No hay sección seleccionada')
        return
      }
      
      this.loadingMaterias = true
      try {
        console.log('🔍 Cargando materias para sección:', this.seccionSeleccionada.id)
        
        const data = await obtenerMaterias({
          seccion_id: this.seccionSeleccionada.id
        })
        
        console.log('📦 Raw data from API:', data)
        console.log('📦 Type of data:', Array.isArray(data) ? 'Array' : typeof data)
        
        // Manejar diferentes formatos de respuesta
        let materiasArray = []
        if (Array.isArray(data)) {
          materiasArray = data
        } else if (data && data.materias) {
          materiasArray = data.materias
        } else if (data && data.results) {
          materiasArray = data.results
        } else if (data && typeof data === 'object') {
          // Si es un objeto, convertir a array
          materiasArray = Object.values(data)
        }
        
        this.materias = materiasArray
        console.log('✅ Materias cargadas:', this.materias.length, this.materias)
      } catch (error) {
        console.error('❌ Error al cargar materias:', error)
        console.error('❌ Error response:', error.response?.data)
        this.$emit('notify', {
          message: 'Error al cargar las materias',
          color: 'error'
        })
      } finally {
        this.loadingMaterias = false
      }
    },
    async cargarActividades() {
      if (!this.seccionSeleccionada) {
        console.error('No hay sección seleccionada')
        return
      }
      
      this.loadingActividades = true
      try {
        console.log('🔍 Cargando actividades para sección:', this.seccionSeleccionada.id)
        
        const data = await obtenerActividades({
          seccion_id: this.seccionSeleccionada.id
        })
        
        this.actividades = (data || []).map(item => ({
          id: item.id,
          nombre: item.nombre,
          nombre_completo: `${item.nombre} - ${item.tipo_actividad?.nombre || ''} (${item.materia?.nombre || ''})`,
          tipo: item.tipo_actividad?.nombre || '',
          valor_maximo: item.valor_maximo,
          materia: item.materia?.nombre || '',
          seccion_id: item.seccion_id,
          materia_id: item.materia_id
        }))
        
        console.log('✅ Actividades cargadas:', this.actividades.length)
      } catch (error) {
        console.error('❌ Error al cargar actividades:', error)
        this.$emit('notify', {
          message: 'Error al cargar las actividades',
          color: 'error'
        })
      } finally {
        this.loadingActividades = false
      }
    },
    async cargarAlumnos() {
      if (!this.actividadSeleccionada) {
        console.error('No hay actividad seleccionada')
        return
      }

      if (!this.actividadSeleccionada.seccion_id) {
        console.error('La actividad no tiene seccion_id:', this.actividadSeleccionada)
        this.$emit('notify', {
          message: 'Error: La actividad no tiene una sección asignada',
          color: 'error'
        })
        return
      }

      this.loading = true
      try {
        console.log('🔍 Cargando alumnos de la sección:', this.actividadSeleccionada.seccion_id)
        
        // Cargar alumnos de la sección
        const alumnos = await buscarAlumnosMatriculados(
          this.actividadSeleccionada.seccion_id,
          '',
          100
        )

        console.log('📋 Alumnos recibidos:', alumnos ? alumnos.length : 0)
        console.log('📋 Tipo de alumnos:', typeof alumnos, Array.isArray(alumnos))
        console.log('📋 Contenido de alumnos:', alumnos)

        // Filtrar alumnos únicos
        const alumnosUnicos = []
        const idsVistos = new Set()
        
        const alumnosArray = Array.isArray(alumnos) ? alumnos : []
        
        alumnosArray.forEach(alumno => {
          if (!idsVistos.has(alumno.id)) {
            idsVistos.add(alumno.id)
            alumnosUnicos.push(alumno)
          }
        })

        console.log('✅ Alumnos únicos:', alumnosUnicos.length)

        // Cargar calificaciones existentes para esta actividad
        const calificaciones = await obtenerCalificacionesActividades({
          actividad_id: this.actividadSeleccionada.id
        })

        console.log('📊 Calificaciones existentes:', calificaciones ? calificaciones.length : 0)

        // Mapear alumnos con sus calificaciones
        this.alumnos = alumnosUnicos.map(alumno => {
          const calif = (calificaciones || []).find(c => c.alumno_id === alumno.id)
          return {
            id: alumno.id,
            nombre_completo: alumno.nombre_completo,
            nota_obtenida: calif?.nota_obtenida || null,
            observaciones: calif?.observaciones || '',
            fecha_calificacion: calif?.fecha_calificacion || '',
            calificacion_id: calif?.id || null,
            calificado: !!calif
          }
        })

        this.alumnosFiltrados = [...this.alumnos]
        console.log('✅ Tabla actualizada con', this.alumnos.length, 'alumnos')
      } catch (error) {
        console.error('❌ Error al cargar alumnos:', error)
        this.$emit('notify', {
          message: 'Error al cargar los alumnos',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    buscarAlumno(query) {
      if (this.busquedaTimeout) {
        clearTimeout(this.busquedaTimeout)
      }

      if (!query || query.trim().length === 0) {
        this.alumnosFiltrados = [...this.alumnos]
        return
      }

      this.busquedaTimeout = setTimeout(() => {
        const busquedaLower = query.toLowerCase()
        this.alumnosFiltrados = this.alumnos.filter(a =>
          a.nombre_completo.toLowerCase().includes(busquedaLower)
        )
      }, 300)
    },
    abrirDialogCalificar(alumno) {
      this.alumnoCalificando = alumno
      this.formCalificacion = {
        nota_obtenida: alumno.nota_obtenida,
        fecha_calificacion: alumno.fecha_calificacion || new Date().toISOString().split('T')[0],
        observaciones: alumno.observaciones || ''
      }
      this.dialogCalificar = true
    },
    async guardarCalificacion() {
      // Validar que la nota no exceda el valor máximo
      if (this.formCalificacion.nota_obtenida > this.actividadSeleccionada.valor_maximo) {
        this.$emit('notify', {
          message: `La nota no puede ser mayor a ${this.actividadSeleccionada.valor_maximo}`,
          color: 'error'
        })
        return
      }

      this.guardando = true
      try {
        const payload = {
          actividad_id: this.actividadSeleccionada.id,
          alumno_id: this.alumnoCalificando.id,
          nota_obtenida: this.formCalificacion.nota_obtenida,
          fecha_calificacion: this.formCalificacion.fecha_calificacion || undefined,
          observaciones: this.formCalificacion.observaciones || undefined
        }

        const response = await asignarCalificacionActividad(payload)

        this.$emit('notify', {
          message: response.mensaje || 'Calificación registrada exitosamente',
          color: 'success'
        })

        this.dialogCalificar = false
        await this.cargarAlumnos()
      } catch (error) {
        console.error('Error al guardar calificación:', error)
        this.$emit('notify', {
          message: error.response?.data?.error || error.response?.data?.message || 'Error al guardar la calificación',
          color: 'error'
        })
      } finally {
        this.guardando = false
      }
    }
  }
}
</script>

<style scoped>
/* styles if needed */
</style>
