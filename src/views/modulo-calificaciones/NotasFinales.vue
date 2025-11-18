<template>
  <v-card>
    <v-card-title>Calcular Notas Finales</v-card-title>
    
    <v-card-text>
      <!-- Formulario para calcular -->
      <v-row class="mb-4">
        <v-col cols="12" sm="3">
          <v-select
            v-model="filtros.materia_id"
            :items="materias"
            item-title="nombre"
            item-value="id"
            label="Materia"
            required
            @update:modelValue="onMateriaChange"
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="filtros.seccion_id"
            :items="secciones"
            item-title="nombre_completo"
            item-value="id"
            label="Sección"
            required
            @update:modelValue="onSeccionChange"
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="trimestreSeleccionado"
            :items="opcionesTrimestre"
            label="Trimestre"
            clearable
            @update:modelValue="aplicarTrimestre"
          />
        </v-col>
        <v-col cols="12" sm="3" class="d-flex align-center">
          <v-btn
            color="primary"
            @click="calcularNotasConParametros"
            :disabled="!filtros.materia_id || !filtros.seccion_id"
            :loading="calculando"
            block
          >
            Calcular
          </v-btn>
        </v-col>
      </v-row>

      <!-- Filtro de Período -->
      <v-row class="mb-4" v-if="filtros.materia_id && filtros.seccion_id">
        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-text>
              <v-chip-group
                v-model="filtroPeriodo"
                selected-class="text-primary"
                @update:modelValue="aplicarFiltroPeriodo"
              >
                <v-chip value="todos" filter>Todos los períodos</v-chip>
                <v-chip value="ultimo" filter>Solo último</v-chip>
                <v-chip value="1er Trimestre" filter>1er Trimestre</v-chip>
                <v-chip value="2do Trimestre" filter>2do Trimestre</v-chip>
                <v-chip value="3er Trimestre" filter>3er Trimestre</v-chip>
                <v-chip value="Anual" filter>Anual</v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Botón para calcular todas las calificaciones -->
      <v-row v-if="filtros.materia_id && filtros.seccion_id" class="mb-4">
        <v-col cols="12">
          <v-card variant="outlined" color="success">
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" md="8">
                  <div class="text-subtitle-1 font-weight-bold">Calcular Todas las Calificaciones</div>
                  <div class="text-caption">Calcula las notas finales de todos los alumnos en esta materia/sección sin aplicar filtros de fecha.</div>
                </v-col>
                <v-col cols="12" md="4" class="d-flex justify-end">
                  <v-btn
                    color="success"
                    size="large"
                    @click="calcularTodasSinFiltros"
                    :loading="calculandoTodas"
                  >
                    Calcular Todas
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Resultados de calificaciones finales -->
      <v-row>
        <v-col cols="12">
          <v-alert
            v-if="!loading && calificaciones.length === 0 && (filtros.materia_id || filtros.seccion_id)"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            No hay calificaciones calculadas aún. Selecciona materia y sección, luego haz clic en "Calcular" con los filtros deseados o en "Calcular Todas" para todas las calificaciones.
          </v-alert>
          
          <v-data-table
            :headers="headers"
            :items="calificaciones"
            :loading="loading"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:item.nota_final="{ item }">
              <v-chip
                :color="getColorNota(item.nota_final)"
                size="small"
              >
                {{ formatNota(item.nota_final) }}
              </v-chip>
            </template>
            <template v-slot:item.acciones="{ item }">
              <v-btn
                color="info"
                size="small"
                variant="tonal"
                @click="verDesglose(item)"
              >
                Ver Desglose
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Diálogo de desglose -->
    <v-dialog v-model="dialogDesglose" max-width="600">
      <v-card v-if="desgloseSeleccionado">
        <v-card-title>
          Desglose de Calificación - {{ desgloseSeleccionado.alumno }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-card variant="outlined" class="mb-3">
                <v-card-text>
                  <div class="text-h4 text-center">
                    {{ formatNota(desgloseSeleccionado.nota_final) }}
                  </div>
                  <div class="text-center text-caption">Nota Final</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="desgloseSeleccionado.desglose">
            <v-col cols="12" sm="4">
              <v-card variant="tonal" color="purple">
                <v-card-text>
                  <div class="text-subtitle-2">Actividades Integradoras</div>
                  <div class="text-h6">{{ formatNota(desgloseSeleccionado.desglose.actividades_integradoras?.nota) }}</div>
                  <div class="text-caption">
                    {{ desgloseSeleccionado.desglose.actividades_integradoras?.porcentaje || 0 }}% 
                    = {{ formatNota(desgloseSeleccionado.desglose.actividades_integradoras?.aporte) }} pts
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="tonal" color="orange">
                <v-card-text>
                  <div class="text-subtitle-2">Exámenes</div>
                  <div class="text-h6">{{ formatNota(desgloseSeleccionado.desglose.examenes?.nota) }}</div>
                  <div class="text-caption">
                    {{ desgloseSeleccionado.desglose.examenes?.porcentaje || 0 }}% 
                    = {{ formatNota(desgloseSeleccionado.desglose.examenes?.aporte) }} pts
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="tonal" color="blue">
                <v-card-text>
                  <div class="text-subtitle-2">Tareas</div>
                  <div class="text-h6">{{ formatNota(desgloseSeleccionado.desglose.tareas?.nota) }}</div>
                  <div class="text-caption">
                    {{ desgloseSeleccionado.desglose.tareas?.porcentaje || 0 }}% 
                    = {{ formatNota(desgloseSeleccionado.desglose.tareas?.aporte) }} pts
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mt-3">
            <v-col cols="12">
              <v-divider />
              <div class="text-caption mt-2">
                <strong>Periodo:</strong> {{ desgloseSeleccionado.periodo }}<br>
                <strong>Fecha de Cálculo:</strong> {{ desgloseSeleccionado.fecha_calculo }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogDesglose = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { calcularNotaFinal, calcularNotaFinalSeccion, calcularNotaAnualSeccion, obtenerCalificaciones } from '@/apis/calificaciones';
import { buscarAlumnosMatriculados } from '@/apis/calificaciones';
import { obtenerSecciones } from '@/apis/secciones';
import { obtenerMaterias } from '@/apis/materias';

export default {
  name: 'NotasFinales',
  data() {
    return {
      filtros: {
        materia_id: null,
        seccion_id: null
      },
      trimestreSeleccionado: null,
      opcionesTrimestre: [
        { value: 1, title: '1er Trimestre (Ene-Abr)' },
        { value: 2, title: '2do Trimestre (May-Jul)' },
        { value: 3, title: '3er Trimestre (Ago-Oct)' }
      ],
      filtroPeriodo: 'ultimo',
      calificacionesRaw: [],
      materias: [],
      secciones: [],
      alumnos: [],
      calificaciones: [],
      desgloseSeleccionado: null,
      loading: false,
      calculando: false,
      calculandoTodas: false,
      dialogDesglose: false,
      headers: [
        { title: 'Alumno', key: 'alumno', sortable: true },
        { title: 'Materia', key: 'materia', sortable: true },
        { title: 'Periodo', key: 'periodo', sortable: true },
        { title: 'Nota Final', key: 'nota_final', sortable: true },
        { title: 'Acciones', key: 'acciones', sortable: false }
      ]
    }
  },
  computed: {
  },
  mounted() {
    this.cargarSecciones()
    // No cargar calificaciones automáticamente, esperar a que se calculen
  },
  methods: {
    async cargarSecciones() {
      try {
        const data = await obtenerSecciones()
        this.secciones = (data.secciones || data || []).map(s => ({
          id: s.id,
          nombre_completo: `${s.grado} ${s.codigo} - ${s.anio_lectivo}`,
          grado: s.grado
        }))
      } catch (error) {
        console.error('Error al cargar secciones:', error)
      }
    },
    async cargarMaterias() {
      if (!this.filtros.seccion_id) {
        this.materias = []
        return
      }

      try {
        const data = await obtenerMaterias({ seccion_id: this.filtros.seccion_id })
        this.materias = data || []
      } catch (error) {
        console.error('Error al cargar materias:', error)
        this.materias = []
      }
    },
    async onSeccionChange() {
      // Limpiar materia seleccionada cuando cambia la sección
      this.filtros.materia_id = null
      this.alumnoSeleccionado = null
      this.calificaciones = []
      
      // Cargar materias y alumnos para la nueva sección
      await this.cargarMaterias()
      await this.cargarAlumnos()
    },
    async onMateriaChange() {
      // Limpiar selecciones anteriores
      this.trimestreSeleccionado = null
      this.filtroPeriodo = 'todos'
      
      // Si hay materia y sección seleccionadas, cargar calificaciones
      if (this.filtros.materia_id && this.filtros.seccion_id) {
        await this.cargarCalificaciones()
      } else {
        // Si no hay materia seleccionada, limpiar la tabla
        this.calificaciones = []
        this.calificacionesRaw = []
      }
    },
    aplicarTrimestre() {
      if (!this.trimestreSeleccionado) {
        this.filtroPeriodo = 'todos'
        return
      }

      // Sincronizar chip de filtro con el trimestre seleccionado
      const filtros = {
        1: '1er Trimestre',
        2: '2do Trimestre',
        3: '3er Trimestre'
      }
      
      this.filtroPeriodo = filtros[this.trimestreSeleccionado] || 'todos'
      console.log(`📅 Trimestre ${this.trimestreSeleccionado} seleccionado`)
    },

    aplicarFiltroPeriodo() {
      // Sincronizar el dropdown de trimestre cuando se selecciona un chip
      if (this.filtroPeriodo === '1er Trimestre') {
        this.trimestreSeleccionado = 1
      } else if (this.filtroPeriodo === '2do Trimestre') {
        this.trimestreSeleccionado = 2
      } else if (this.filtroPeriodo === '3er Trimestre') {
        this.trimestreSeleccionado = 3
      } else if (this.filtroPeriodo === 'todos') {
        this.trimestreSeleccionado = null
      }
      
      if (!this.calificacionesRaw || this.calificacionesRaw.length === 0) {
        this.calificaciones = []
        return
      }

      let calificacionesFiltradas = [...this.calificacionesRaw]
      
      // PRIMERO: Filtrar por materia seleccionada
      if (this.filtros.materia_id) {
        calificacionesFiltradas = calificacionesFiltradas.filter(cal => 
          Number(cal.materia_id) === Number(this.filtros.materia_id)
        )
      }

      // SEGUNDO: Aplicar filtro de período
      if (this.filtroPeriodo === 'todos') {
        // Mostrar todas las calificaciones (ya filtradas por materia)
        this.calificaciones = calificacionesFiltradas
      } else if (this.filtroPeriodo === 'ultimo') {
        // Deduplicar: mantener solo la calificación más reciente por alumno-materia
        const calificacionesUnicas = new Map()
        
        calificacionesFiltradas.forEach(cal => {
          const key = `${cal.alumno_id}-${cal.materia_id}`
          const existente = calificacionesUnicas.get(key)
          
          // Si no existe o la actual es más reciente, guardarla
          if (!existente || new Date(cal.fecha_calculo) > new Date(existente.fecha_calculo)) {
            calificacionesUnicas.set(key, cal)
          }
        })
        
        this.calificaciones = Array.from(calificacionesUnicas.values())
      } else {
        // Filtrar por período específico (1er Trimestre, 2do Trimestre, etc.)
        calificacionesFiltradas = calificacionesFiltradas.filter(cal => {
          // Normalizar el período para comparación
          const periodoNormalizado = cal.periodo?.toLowerCase().trim() || ''
          const filtroNormalizado = this.filtroPeriodo.toLowerCase().trim()
          
          // Extraer número de trimestre del filtro si aplica
          let numeroTrimestre = null
          if (this.filtroPeriodo === '1er Trimestre') numeroTrimestre = 1
          if (this.filtroPeriodo === '2do Trimestre') numeroTrimestre = 2
          if (this.filtroPeriodo === '3er Trimestre') numeroTrimestre = 3
          
          // Verificar por texto del periodo o por número en el texto
          const coincideTexto = periodoNormalizado.includes(filtroNormalizado) || 
                                periodoNormalizado === filtroNormalizado
          const coincideTrimestre = numeroTrimestre && periodoNormalizado.includes(`trimestre${numeroTrimestre}`) ||
                                     periodoNormalizado.includes(`trimestres: ${numeroTrimestre}`)
          
          return coincideTexto || 
                 coincideTrimestre ||
                 (this.filtroPeriodo === 'Anual' && periodoNormalizado.includes('anual'))
        })
        
        this.calificaciones = calificacionesFiltradas
      }
      
      console.log(`🔍 Filtro periodo "${this.filtroPeriodo}": ${this.calificaciones.length} de ${this.calificacionesRaw.length} calificaciones`)
    },
    async cargarAlumnos() {
      if (!this.filtros.seccion_id) return

      try {
        const data = await buscarAlumnosMatriculados(this.filtros.seccion_id, '', 100)
        const alumnosRaw = data || []
        
        // Filtrar alumnos únicos (eliminar duplicados por ID)
        const alumnosUnicos = []
        const idsVistos = new Set()
        
        alumnosRaw.forEach(alumno => {
          if (!idsVistos.has(alumno.id)) {
            idsVistos.add(alumno.id)
            alumnosUnicos.push(alumno)
          }
        })
        
        this.alumnos = alumnosUnicos
      } catch (error) {
        console.error('Error al cargar alumnos:', error)
        this.alumnos = []
      }
    },
    async cargarCalificaciones(filtrosOpcionales = null) {
      this.loading = true
      try {
        // Si no hay filtros, intentar usar los filtros actuales
        const params = filtrosOpcionales || {}
        
        // Si hay filtros de materia y sección, agregarlos
        if (this.filtros.materia_id && !params.materia_id) {
          params.materia_id = this.filtros.materia_id
        }
        if (this.filtros.seccion_id && !params.seccion_id) {
          params.seccion_id = this.filtros.seccion_id
        }

        const data = await obtenerCalificaciones(params)
        this.calificacionesRaw = (data || []).map(item => ({
          id: item.id,
          alumno: item.alumno?.nombre || item.alumno?.nombre_completo || '',
          materia: item.materia?.nombre || '',
          periodo: item.periodo || '',
          nota_final: parseFloat(item.nota_final) || 0,
          nota_actividades_integradoras: parseFloat(item.nota_actividades_integradoras) || 0,
          nota_examenes: parseFloat(item.nota_examenes) || 0,
          nota_tareas: parseFloat(item.nota_tareas) || 0,
          fecha_calculo: item.fecha_calculo,
          alumno_id: item.alumno_id,
          materia_id: item.materia_id
        }))

        // Aplicar el filtro de período actual
        this.aplicarFiltroPeriodo()
        
        console.log(`📊 Calificaciones cargadas: ${this.calificacionesRaw.length} total`)
      } catch (error) {
        console.error('Error al cargar calificaciones:', error)
        this.calificaciones = []
      } finally {
        this.loading = false
      }
    },
    async calcularNotaIndividual() {
      if (!this.alumnoSeleccionado || !this.filtros.materia_id || !this.filtros.seccion_id) return

      this.calculandoIndividual = true
      try {
        const payload = {
          alumno_id: this.alumnoSeleccionado.id,
          materia_id: this.filtros.materia_id,
          seccion_id: this.filtros.seccion_id
        }

        if (this.filtros.fecha_inicio) payload.fecha_inicio = this.filtros.fecha_inicio
        if (this.filtros.fecha_fin) payload.fecha_fin = this.filtros.fecha_fin

        const response = await calcularNotaFinal(payload)

        // Emitir notificación
        try {
          this.$emit('notify', {
            message: response.mensaje || 'Nota calculada exitosamente',
            color: 'success'
          })
        } catch (emitError) {
          console.error('Error al emitir notificación:', emitError)
        }

        // Mostrar desglose inmediatamente
        if (response.desglose) {
          this.desgloseSeleccionado = {
            alumno: this.alumnoSeleccionado.nombre_completo,
            nota_final: response.calificacion.nota_final,
            periodo: response.calificacion.periodo,
            fecha_calculo: response.calificacion.fecha_calculo,
            desglose: response.desglose
          }
          this.dialogDesglose = true
        }

        await this.cargarCalificaciones()
      } catch (error) {
        console.error('Error al calcular nota:', error)
        try {
          this.$emit('notify', {
            message: error.response?.data?.message || 'Error al calcular la nota',
            color: 'error'
          })
        } catch (emitError) {
          console.error('Error al emitir notificación de error:', emitError)
        }
      } finally {
        this.calculandoIndividual = false
      }
    },
    async calcularNotasConParametros() {
      if (!this.filtros.materia_id || !this.filtros.seccion_id) {
        this.$emit('notify', {
          message: 'Selecciona materia y sección',
          color: 'warning'
        })
        return
      }

      if (!this.trimestreSeleccionado) {
        this.$emit('notify', {
          message: 'Selecciona un trimestre para calcular',
          color: 'warning'
        })
        return
      }

      this.calculando = true

      try {
        const payload = {
          materia_id: this.filtros.materia_id,
          seccion_id: this.filtros.seccion_id,
          trimestre: this.trimestreSeleccionado
        }

        console.log('📊 Calculando trimestre para toda la sección:', payload)
        const response = await calcularNotaFinalSeccion(payload)

        this.$emit('notify', {
          message: `${response.mensaje}: ${response.calculados_exitosamente} exitosas, ${response.con_errores} errores`,
          color: response.calculados_exitosamente > 0 ? 'success' : 'error'
        })

        // Log de errores si los hay
        if (response.errores && response.errores.length > 0) {
          console.warn('⚠️ Errores al calcular:', response.errores)
        }

        await this.cargarCalificaciones()
      } catch (error) {
        console.error('❌ Error al calcular notas:', error)
        this.$emit('notify', {
          message: error.response?.data?.detail || 'Error al calcular las notas',
          color: 'error'
        })
      } finally {
        this.calculando = false
      }
    },
    async calcularTodasSinFiltros() {
      if (!this.filtros.materia_id || !this.filtros.seccion_id) {
        this.$emit('notify', {
          message: 'Selecciona materia y sección',
          color: 'warning'
        })
        return
      }

      this.calculandoTodas = true

      try {
        const payload = {
          materia_id: this.filtros.materia_id,
          seccion_id: this.filtros.seccion_id
        }

        console.log('📊 Calculando nota ANUAL para toda la sección:', payload)
        const response = await calcularNotaAnualSeccion(payload)

        this.$emit('notify', {
          message: `${response.mensaje}: ${response.calculados_exitosamente} exitosas, ${response.con_errores} errores`,
          color: response.calculados_exitosamente > 0 ? 'success' : 'error'
        })

        // Log de información sobre trimestres
        if (response.resultados && response.resultados.length > 0) {
          console.log('✅ Resultados:', response.resultados.map(r => ({
            alumno: r.nombre_alumno,
            nota: r.calificacion_anual.nota_final,
            trimestres_incluidos: r.trimestres_incluidos,
            trimestres_faltantes: r.trimestres_faltantes
          })))
        }

        // Log de errores si los hay
        if (response.errores && response.errores.length > 0) {
          console.warn('⚠️ Errores al calcular:', response.errores)
        }

        await this.cargarCalificaciones()
      } catch (error) {
        console.error('❌ Error al calcular notas anuales:', error)
        this.$emit('notify', {
          message: error.response?.data?.detail || 'Error al calcular las notas anuales',
          color: 'error'
        })
      } finally {
        this.calculandoTodas = false
      }
    },
    getColorNota(nota) {
      const n = parseFloat(nota) || 0
      if (n >= 7) return 'success'
      if (n >= 5) return 'warning'
      return 'error'
    },
    formatNota(nota) {
      const n = parseFloat(nota)
      return isNaN(n) ? '0.00' : n.toFixed(2)
    },
    verDesglose(item) {
      // Buscar la calificación completa con desglose
      this.desgloseSeleccionado = {
        alumno: item.alumno,
        nota_final: item.nota_final,
        periodo: item.periodo,
        fecha_calculo: item.fecha_calculo,
        desglose: {
          actividades_integradoras: {
            nota: item.nota_actividades_integradoras || 0,
            porcentaje: 35, // TODO: Obtener del backend
            aporte: (item.nota_actividades_integradoras || 0) * 0.35
          },
          examenes: {
            nota: item.nota_examenes || 0,
            porcentaje: 35,
            aporte: (item.nota_examenes || 0) * 0.35
          },
          tareas: {
            nota: item.nota_tareas || 0,
            porcentaje: 30,
            aporte: (item.nota_tareas || 0) * 0.30
          }
        }
      }
      this.dialogDesglose = true
    }
  }
}
</script>

<style scoped>
/* styles if needed */
</style>
