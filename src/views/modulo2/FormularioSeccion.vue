<template>
  <v-card>
    <v-card-title>Crear/Editar Sección</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="seccion.grado"
              :items="grados"
              label="Grado"
              :rules="[v => !!v || 'Campo requerido', validarGrado]"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="seccion.codigo"
              label="Código"
              :rules="[v => !!v || 'Campo requerido', validarCodigo]"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="seccion.jornada"
              label="Jornada"
              :rules="[v => !!v || 'Campo requerido']"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="seccion.capacidad_maxima"
              label="Capacidad Máxima"
              type="number"
              :rules="[v => !!v || 'Campo requerido', v => v > 0 || 'Debe ser mayor a 0']"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="seccion.plan_estudio_id"
              label="Plan de Estudio"
              type="number"
              :rules="[v => !!v || 'Campo requerido']"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="seccion.anio_lectivo"
              label="Año Lectivo"
              type="number"
              :rules="[v => !!v || 'Campo requerido', v => v >= 2000 || 'Año no válido']"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="seccion.estado"
              :items="estados"
              label="Estado"
              :rules="[v => !!v || 'Campo requerido']"
              required
            />
          </v-col>
        </v-row>
  <v-btn color="primary" @click="submitForm" class="mt-4">
    {{ modoClonar ? 'Clonar' : 'Guardar' }}
  </v-btn>
  <v-btn color="secondary" @click="$emit('cancelar')" v-if="modoClonar" class="mt-4 ml-2">
    Cancelar
  </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { crearSeccion, editarSeccion } from '../../apis/secciones';

export default {
  name: 'FormularioSeccion',
  props: {
    seccionEdit: {
      type: Object,
      default: null
    },
    modoClonar: {
      type: Boolean,
      default: false
    },
    seccion: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      valid: false,
      seccion: {
        jornada: '',
        codigo: '',
        estado: '',
        grado: '',
        capacidad_maxima: '',
        plan_estudio_id: '',
        anio_lectivo: ''
      },
      estados: ['Abierta', 'Cerrada'],
      grados: ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto'],
      cargando: false,
      editId: null
    }
  },
  watch: {
    seccionEdit: {
      handler(val) {
        if (val) {
          this.seccion = { ...val }
          this.editId = val.id
        } else {
          this.editId = null
          this.seccion = {
            jornada: '',
            codigo: '',
            estado: '',
            grado: '',
            capacidad_maxima: '',
            plan_estudio_id: '',
            anio_lectivo: ''
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    validarCodigo(v) {
      // Aquí puedes agregar lógica extra para validar el código
      return true
    },
    validarGrado(v) {
      // Aquí puedes agregar lógica extra para validar el grado
      return true
    },
    resetValidation() {
      this.valid = false
      if (this.$refs.form) {
        this.$refs.form.resetValidation && this.$refs.form.resetValidation()
      }
    },
    async submitForm() {
      if (this.$refs.form.validate()) {
        if (this.modoClonar) {
          this.$emit('submit', this.seccion)
        } else {
          this.cargando = true
          try {
            if (this.editId) {
              await editarSeccion(this.editId, this.seccion)
              alert('Sección editada exitosamente.')
              this.$emit('reset-edit')
            } else {
              await crearSeccion(this.seccion)
              alert('Sección guardada exitosamente.')
            }
            this.$emit('guardar-seccion', this.seccion)
            // Limpiar el formulario
            this.seccion = {
              jornada: '',
              codigo: '',
              estado: '',
              grado: '',
              capacidad_maxima: '',
              plan_estudio_id: '',
              anio_lectivo: ''
            }
            this.editId = null
            if (this.$refs.form && this.$refs.form.reset) {
              this.$refs.form.reset();
            }
            this.resetValidation()
          } catch (error) {
            alert('Error al guardar la sección.')
          } finally {
            this.cargando = false
          }
        }
      }
    }
  }
}
</script>

<style scoped>
/* Add styles here or remove this block if not needed */
</style>
