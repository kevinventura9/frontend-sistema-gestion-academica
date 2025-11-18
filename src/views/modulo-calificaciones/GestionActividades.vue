<template>
  <v-card>
    <v-card-title>
      Gestión de Actividades
      <v-spacer />
      <v-btn color="primary" @click="abrirDialogNueva" :disabled="!materiaSeleccionada || !seccionSeleccionada">
        <v-icon start>ri-add-line</v-icon>
        Nueva Actividad
      </v-btn>
    </v-card-title>
    
    <v-card-text>
      <!-- Filtros -->
      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <v-select
            v-model="materiaSeleccionada"
            :items="materias"
            item-title="nombre"
            item-value="id"
            label="Materia"
            clearable
            @update:modelValue="cargarActividades"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="seccionSeleccionada"
            :items="secciones"
            item-title="nombre_completo"
            item-value="id"
            label="Sección"
            clearable
            @update:modelValue="cargarActividades"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="tipoSeleccionado"
            :items="tiposActividad"
            item-title="nombre"
            item-value="id"
            label="Tipo de Actividad"
            clearable
            @update:modelValue="cargarActividades"
          />
        </v-col>
      </v-row>

      <!-- Tabla de actividades -->
      <v-data-table
        :headers="headers"
        :items="actividades"
        :loading="loading"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item.tipo="{ item }">
          <v-chip :color="getColorTipo(item.tipo_actividad_id)" size="small">
            {{ item.tipo }}
          </v-chip>
        </template>
        <template v-slot:item.trimestre="{ item }">
          <v-chip color="primary" size="small">
            {{ item.trimestre }}° Trim
          </v-chip>
        </template>
        <template v-slot:item.acciones="{ item }">
          <v-btn
            color="primary"
            size="small"
            class="me-2"
            @click="editarActividad(item)"
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

    <!-- Diálogo para crear/editar actividad -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card>
        <v-card-title>
          {{ modoEdicion ? 'Editar Actividad' : 'Nueva Actividad' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formActividad.materia_id"
                  :items="materias"
                  item-title="nombre"
                  item-value="id"
                  label="Materia *"
                  :readonly="modoEdicion"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formActividad.seccion_id"
                  :items="secciones"
                  item-title="nombre_completo"
                  item-value="id"
                  label="Sección *"
                  :readonly="modoEdicion"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formActividad.tipo_actividad_id"
                  :items="tiposActividad"
                  item-title="nombre"
                  item-value="id"
                  label="Tipo de Actividad *"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="formActividad.valor_maximo"
                  label="Valor Máximo *"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formActividad.trimestre"
                  :items="trimestres"
                  item-title="text"
                  item-value="value"
                  label="Trimestre *"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formActividad.nombre"
                  label="Nombre de la Actividad *"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formActividad.descripcion"
                  label="Descripción"
                  rows="2"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formActividad.fecha_asignacion"
                  label="Fecha de Asignación"
                  type="date"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formActividad.fecha_entrega"
                  label="Fecha de Entrega"
                  type="date"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            @click="guardarActividad"
            :loading="guardando"
          >
            {{ modoEdicion ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h6">¿Eliminar actividad?</v-card-title>
        <v-card-text>
          <p v-if="actividadSeleccionada">
            ¿Estás seguro de eliminar la actividad
            <strong>{{ actividadSeleccionada.nombre }}</strong>?
          </p>
          <p class="text-caption text-error mt-2">
            Esta acción no se puede deshacer. No se puede eliminar si ya tiene calificaciones asignadas.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn 
            color="error" 
            @click="eliminarActividadConfirmada"
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
  obtenerActividades, 
  crearActividad, 
  actualizarActividad, 
  eliminarActividad,
  obtenerTiposActividad 
} from '@/apis/calificaciones';
import { obtenerSecciones } from '@/apis/secciones';
import { obtenerMaterias } from '@/apis/materias';

export default {
  name: 'GestionActividades',
  data() {
    return {
      actividades: [],
      tiposActividad: [],
      materias: [],
      secciones: [],
      materiaSeleccionada: null,
      seccionSeleccionada: null,
      tipoSeleccionado: null,
      loading: false,
      dialog: false,
      dialogEliminar: false,
      modoEdicion: false,
      guardando: false,
      eliminando: false,
      actividadSeleccionada: null,
      formActividad: {
        materia_id: null,
        seccion_id: null,
        tipo_actividad_id: null,
        nombre: '',
        descripcion: '',
        fecha_asignacion: '',
        fecha_entrega: '',
        valor_maximo: 10,
        trimestre: 1
      },
      trimestres: [
        { value: 1, text: '1er Trimestre (Ene-Abr)' },
        { value: 2, text: '2do Trimestre (May-Jul)' },
        { value: 3, text: '3er Trimestre (Ago-Oct)' }
      ],
      headers: [
        { title: 'Nombre', key: 'nombre', sortable: true },
        { title: 'Tipo', key: 'tipo', sortable: true },
        { title: 'Trimestre', key: 'trimestre', sortable: true },
        { title: 'Materia', key: 'materia', sortable: true },
        { title: 'Valor Máximo', key: 'valor_maximo', sortable: true },
        { title: 'Fecha Asignación', key: 'fecha_asignacion', sortable: true },
        { title: 'Fecha Entrega', key: 'fecha_entrega', sortable: true },
        { title: 'Acciones', key: 'acciones', sortable: false }
      ]
    }
  },
  mounted() {
    this.cargarTiposActividad()
    this.cargarSecciones()
    this.cargarMaterias()
  },
  methods: {
    async cargarTiposActividad() {
      try {
        this.tiposActividad = await obtenerTiposActividad()
        console.log('📋 Tipos de actividad:', this.tiposActividad)
      } catch (error) {
        console.error('Error al cargar tipos de actividad:', error)
      }
    },
    async cargarSecciones() {
      try {
        const data = await obtenerSecciones()
        this.secciones = (data.secciones || data || []).map(s => ({
          id: s.id,
          nombre_completo: `${s.grado} ${s.codigo} - ${s.anio_lectivo}`
        }))
      } catch (error) {
        console.error('Error al cargar secciones:', error)
      }
    },
    async cargarMaterias() {
      try {
        const data = await obtenerMaterias()
        this.materias = data || []
        console.log('📚 Materias cargadas:', this.materias)
      } catch (error) {
        console.error('Error al cargar materias:', error)
      }
    },
    async cargarActividades() {
      this.loading = true
      try {
        const params = {}
        if (this.materiaSeleccionada) params.materia_id = this.materiaSeleccionada
        if (this.seccionSeleccionada) params.seccion_id = this.seccionSeleccionada
        if (this.tipoSeleccionado) params.tipo_actividad_id = this.tipoSeleccionado

        console.log('🔍 Cargando actividades con filtros:', params)

        const data = await obtenerActividades(params)
        this.actividades = (data || []).map(item => ({
          id: item.id,
          nombre: item.nombre,
          tipo: item.tipo_actividad?.nombre || '',
          tipo_actividad_id: item.tipo_actividad_id,
          materia: item.materia?.nombre || '',
          valor_maximo: item.valor_maximo,
          trimestre: item.trimestre || 1,
          fecha_entrega: item.fecha_entrega ? item.fecha_entrega.split('T')[0] : '-',
          fecha_asignacion: item.fecha_asignacion ? item.fecha_asignacion.split('T')[0] : null,
          descripcion: item.descripcion,
          materia_id: item.materia_id,
          seccion_id: item.seccion_id
        }))

        console.log('📦 Actividades cargadas:', this.actividades)
      } catch (error) {
        console.error('Error al cargar actividades:', error)
        this.$emit('notify', {
          message: 'Error al cargar las actividades',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    getColorTipo(tipoId) {
      const colores = {
        1: 'purple',    // Actividad Integradora
        2: 'orange',    // Examen
        3: 'blue'       // Tarea
      }
      return colores[tipoId] || 'grey'
    },
    abrirDialogNueva() {
      this.modoEdicion = false
      this.formActividad = {
        materia_id: this.materiaSeleccionada,
        seccion_id: this.seccionSeleccionada,
        tipo_actividad_id: null,
        nombre: '',
        descripcion: '',
        fecha_asignacion: '',
        fecha_entrega: '',
        valor_maximo: 10,
        trimestre: 1
      }
      this.dialog = true
    },
    editarActividad(item) {
      this.modoEdicion = true
      this.actividadSeleccionada = item
      this.formActividad = {
        materia_id: item.materia_id,
        seccion_id: item.seccion_id,
        tipo_actividad_id: item.tipo_actividad_id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        fecha_asignacion: item.fecha_asignacion,
        fecha_entrega: item.fecha_entrega === '-' ? '' : item.fecha_entrega,
        valor_maximo: item.valor_maximo,
        trimestre: item.trimestre || 1
      }
      this.dialog = true
    },
    async guardarActividad() {
      this.guardando = true
      try {
        const payload = { ...this.formActividad }
        
        // Limpiar campos vacíos opcionales
        if (!payload.descripcion) delete payload.descripcion
        if (!payload.fecha_asignacion) delete payload.fecha_asignacion
        if (!payload.fecha_entrega) delete payload.fecha_entrega

        if (this.modoEdicion) {
          const response = await actualizarActividad(this.actividadSeleccionada.id, payload)
          this.$emit('notify', {
            message: response.mensaje || 'Actividad actualizada correctamente',
            color: 'success'
          })
        } else {
          const response = await crearActividad(payload)
          this.$emit('notify', {
            message: response.mensaje || 'Actividad creada correctamente',
            color: 'success'
          })
        }

        this.dialog = false
        await this.cargarActividades()
      } catch (error) {
        console.error('Error al guardar actividad:', error)
        this.$emit('notify', {
          message: error.response?.data?.message || 'Error al guardar la actividad',
          color: 'error'
        })
      } finally {
        this.guardando = false
      }
    },
    confirmarEliminacion(item) {
      this.actividadSeleccionada = item
      this.dialogEliminar = true
    },
    async eliminarActividadConfirmada() {
      this.eliminando = true
      try {
        const response = await eliminarActividad(this.actividadSeleccionada.id)
        this.$emit('notify', {
          message: response.mensaje || 'Actividad eliminada correctamente',
          color: 'success'
        })

        this.dialogEliminar = false
        this.actividadSeleccionada = null
        await this.cargarActividades()
      } catch (error) {
        console.error('Error al eliminar actividad:', error)
        this.$emit('notify', {
          message: error.response?.data?.message || 'Error al eliminar la actividad',
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
