<template>
  <v-card>
    <v-card-title>Configuración de Porcentajes de Calificación</v-card-title>
    
    <v-card-text>
      <!-- Selección de Materia y Sección -->
      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <v-select
            v-model="materiaSeleccionada"
            :items="materias"
            item-title="nombre"
            item-value="id"
            label="Materia"
            required
            @update:modelValue="cargarConfiguracion"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="seccionSeleccionada"
            :items="secciones"
            item-title="nombre_completo"
            item-value="id"
            label="Sección"
            required
            @update:modelValue="cargarConfiguracion"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="trimestreSeleccionado"
            :items="trimestres"
            item-title="text"
            item-value="value"
            label="Trimestre"
            required
            @update:modelValue="cargarConfiguracion"
          />
        </v-col>
      </v-row>

      <!-- Configuración de Porcentajes -->
      <v-card v-if="materiaSeleccionada && seccionSeleccionada && trimestreSeleccionado" variant="outlined" class="mb-4">
        <v-card-text>
          <v-alert v-if="esNueva" type="info" class="mb-4">
            Esta es una nueva configuración. Los valores mostrados son los predeterminados.
          </v-alert>

          <v-form ref="form">
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model.number="configuracion.porcentaje_actividad_integradora"
                  label="Actividad Integradora (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  required
                  @input="validarSuma"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model.number="configuracion.porcentaje_examenes"
                  label="Exámenes (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  required
                  @input="validarSuma"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model.number="configuracion.porcentaje_tareas"
                  label="Tareas (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  required
                  @input="validarSuma"
                />
              </v-col>
            </v-row>

            <!-- Indicador de suma -->
            <v-row>
              <v-col cols="12">
                <v-alert
                  :type="sumaValida ? 'success' : 'error'"
                  variant="tonal"
                >
                  <strong>Total: {{ sumaTotal }}%</strong>
                  <span v-if="!sumaValida"> - Los porcentajes deben sumar exactamente 100%</span>
                  <span v-else> - ✓ Suma correcta</span>
                </v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="guardar"
            :disabled="!sumaValida"
            :loading="guardando"
          >
            Guardar Configuración
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Mensaje de ayuda -->
      <v-alert v-else type="info">
        Selecciona una materia y una sección para configurar los porcentajes de calificación.
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import { obtenerConfiguracion, guardarConfiguracion } from '@/apis/calificaciones';
import { obtenerSecciones } from '@/apis/secciones';

export default {
  name: 'ConfiguracionPorcentajes',
  data() {
    return {
      materiaSeleccionada: null,
      seccionSeleccionada: null,
      trimestreSeleccionado: null,
      materias: [
        // TODO: Cargar desde el backend cuando tengas el endpoint
        { id: 1, nombre: 'Matemáticas' },
        { id: 2, nombre: 'Ciencias' },
        { id: 3, nombre: 'Sociales' },
        { id: 4, nombre: 'Lenguaje' }
      ],
      secciones: [],
      trimestres: [
        { value: 1, text: '1er Trimestre (Ene-Abr)' },
        { value: 2, text: '2do Trimestre (May-Jul)' },
        { value: 3, text: '3er Trimestre (Ago-Oct)' }
      ],
      configuracion: {
        porcentaje_actividad_integradora: 35,
        porcentaje_examenes: 35,
        porcentaje_tareas: 30
      },
      esNueva: false,
      guardando: false,
      cargando: false
    }
  },
  computed: {
    sumaTotal() {
      return (
        (this.configuracion.porcentaje_actividad_integradora || 0) +
        (this.configuracion.porcentaje_examenes || 0) +
        (this.configuracion.porcentaje_tareas || 0)
      )
    },
    sumaValida() {
      return this.sumaTotal === 100
    }
  },
  mounted() {
    this.cargarSecciones()
  },
  methods: {
    async cargarSecciones() {
      try {
        const data = await obtenerSecciones()
        this.secciones = (data.secciones || data || []).map(s => ({
          id: s.id,
          nombre_completo: `${s.grado} ${s.codigo} - ${s.anio_lectivo}`
        }))
      } catch (error) {
        console.error('Error al cargar secciones:', error)
        this.$emit('notify', {
          message: 'Error al cargar las secciones',
          color: 'error'
        })
      }
    },
    async cargarConfiguracion() {
      if (!this.materiaSeleccionada || !this.seccionSeleccionada || !this.trimestreSeleccionado) return

      this.cargando = true
      try {
        console.log('🔍 Cargando configuración...', {
          materia: this.materiaSeleccionada,
          seccion: this.seccionSeleccionada,
          trimestre: this.trimestreSeleccionado
        })

        const response = await obtenerConfiguracion(
          this.materiaSeleccionada,
          this.seccionSeleccionada,
          this.trimestreSeleccionado
        )

        console.log('📦 Configuración recibida:', response)

        if (response.config) {
          this.configuracion = {
            porcentaje_actividad_integradora: response.config.porcentaje_actividad_integradora,
            porcentaje_examenes: response.config.porcentaje_examenes,
            porcentaje_tareas: response.config.porcentaje_tareas
          }
          this.esNueva = response.es_nueva || false
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error)
        this.$emit('notify', {
          message: 'Error al cargar la configuración',
          color: 'error'
        })
      } finally {
        this.cargando = false
      }
    },
    validarSuma() {
      // Se valida automáticamente con el computed sumaValida
    },
    async guardar() {
      if (!this.sumaValida) {
        this.$emit('notify', {
          message: `Los porcentajes deben sumar 100%. Suma actual: ${this.sumaTotal}%`,
          color: 'error'
        })
        return
      }

      this.guardando = true
      try {
        const payload = {
          materia_id: this.materiaSeleccionada,
          seccion_id: this.seccionSeleccionada,
          trimestre: this.trimestreSeleccionado,
          porcentaje_actividad_integradora: this.configuracion.porcentaje_actividad_integradora,
          porcentaje_examenes: this.configuracion.porcentaje_examenes,
          porcentaje_tareas: this.configuracion.porcentaje_tareas
        }

        console.log('💾 Guardando configuración:', payload)

        const response = await guardarConfiguracion(payload)

        console.log('✅ Configuración guardada:', response)

        this.$emit('notify', {
          message: response.mensaje || 'Configuración guardada exitosamente',
          color: 'success'
        })

        this.esNueva = false
      } catch (error) {
        console.error('Error al guardar configuración:', error)
        
        let mensaje = 'Error al guardar la configuración'
        if (error.response?.data?.errors?.porcentajes) {
          mensaje = error.response.data.errors.porcentajes[0]
        } else if (error.response?.data?.message) {
          mensaje = error.response.data.message
        }

        this.$emit('notify', {
          message: mensaje,
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
