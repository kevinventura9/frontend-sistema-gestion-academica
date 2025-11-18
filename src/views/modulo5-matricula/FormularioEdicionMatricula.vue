<template>
  <v-dialog v-model="dialogModel" max-width="600">
    <v-card>
      <v-card-title>Editar Matrícula</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                :model-value="matricula?.alumno"
                label="Alumno"
                readonly
                disabled
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select 
                v-model="form.anio_lectivo" 
                :items="anios" 
                label="Año Lectivo" 
                :error-messages="fieldErrors.anio_lectivo" 
                required 
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select 
                v-model="form.grado" 
                :items="grados" 
                label="Grado" 
                :error-messages="fieldErrors.grado" 
                required 
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select 
                v-model="form.codigo" 
                :items="['A','B']" 
                label="Código" 
                :error-messages="fieldErrors.codigo" 
                required 
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn 
          color="primary" 
          @click="submit" 
          :disabled="submitting"
        >
          <span v-if="!submitting">Actualizar</span>
          <v-progress-circular v-else indeterminate size="18" color="white" width="2" />
        </v-btn>
        <v-btn text @click="close">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { actualizarMatricula } from '@/apis/matriculas';

export default {
  name: 'FormularioEdicionMatricula',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    matricula: {
      type: Object,
      default: null
    }
  },
  emits: ['update:open', 'updated'],
  data() {
    return {
      valid: false,
      form: {
        anio_lectivo: null,
        grado: null,
        codigo: null
      },
      fieldErrors: {},
      submitting: false,
      anios: Array.from({ length: 2040 - 2024 + 1 }, (_, i) => 2024 + i),
      grados: ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Septimo', 'Octavo', 'Noveno', 'Primer año', 'Segundo año']
    }
  },
  computed: {
    dialogModel: {
      get() {
        return this.open
      },
      set(val) {
        this.$emit('update:open', val)
      }
    }
  },
  watch: {
    open(val) {
      if (val && this.matricula) {
        this.init()
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:open', false)
      this.resetForm()
    },
    init() {
      // Cargar datos actuales de la matrícula
      this.form.anio_lectivo = this.matricula.anio_lectivo
      this.form.grado = this.matricula.grado
      this.form.codigo = this.matricula.codigo
      this.fieldErrors = {}
    },
    resetForm() {
      this.form = {
        anio_lectivo: null,
        grado: null,
        codigo: null
      }
      this.fieldErrors = {}
    },
    async submit() {
      this.fieldErrors = {}
      if (this.$refs.form.validate()) {
        this.submitting = true
        try {
          console.log('📝 Actualizando matrícula ID:', this.matricula.id)
          console.log('📤 Payload:', this.form)
          
          // El backend necesita seccion_id y/o anio_lectivo
          // Como en frontend tenemos grado/codigo separados, enviamos todo
          const payload = {
            anio_lectivo: this.form.anio_lectivo,
            grado: this.form.grado,
            codigo: this.form.codigo
          }
          
          const res = await actualizarMatricula(this.matricula.id, payload)
          console.log('✅ Matrícula actualizada:', res)
          
          this.$emit('updated', res)
          this.$emit('update:open', false)
          this.resetForm()
        } catch (error) {
          console.error('❌ Error al actualizar matrícula:', error)
          const resp = error.response?.data
          
          if (resp?.errors) {
            // 422 Validation errors
            this.fieldErrors = resp.errors
            this.$emit('updated', { 
              success: false, 
              message: resp.message || 'Error de validación', 
              errors: resp.errors 
            })
          } else if (error.response?.status === 404) {
            // 404 No encontrada
            this.$emit('updated', { 
              success: false, 
              message: resp?.message || 'Matrícula no encontrada' 
            })
          } else if (error.response?.status === 409) {
            // 409 Sección llena
            this.$emit('updated', { 
              success: false, 
              message: resp?.message || 'La sección está llena',
              conflict: true
            })
          } else {
            const msg = resp?.message || 'Error al actualizar matrícula'
            this.$emit('updated', { success: false, message: msg })
          }
        } finally {
          this.submitting = false
        }
      }
    }
  }
}
</script>

<style scoped>
/* styles if needed */
</style>
