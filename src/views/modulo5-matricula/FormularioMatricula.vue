<template>
  <v-dialog v-model="dialogModel" max-width="600">
    <template #activator="{ on, attrs }"></template>
    <v-card>
      <v-card-title>Matricular Alumno</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="form.alumno_id"
                v-model:search="searchQuery"
                :items="alumnosOptions"
                :loading="loadingAlumnos"
                item-title="nombre_completo"
                item-value="id"
                label="Alumno"
                placeholder="Escribe para buscar..."
                :rules="[v => !!v || 'Campo requerido']"
                :error-messages="fieldErrors.alumno_id"
                clearable
                no-filter
                required
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      {{ searchQuery && searchQuery.length >= 2 ? 'No se encontraron resultados' : 'Escribe al menos 2 caracteres para buscar' }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>{{ item?.raw?.nombre_completo }}</v-list-item-title>
                    <v-list-item-subtitle v-if="item?.raw?.nie">NIE: {{ item.raw.nie }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="form.anio_lectivo" :items="anios" label="Año Lectivo" :error-messages="fieldErrors.anio_lectivo" required />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="form.grado" :items="grados" label="Grado" :error-messages="fieldErrors.grado" required />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="form.codigo" :items="['A','B']" label="Código" :error-messages="fieldErrors.codigo" required />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="submit" :disabled="submitting">
          <span v-if="!submitting">Matricular</span>
          <v-progress-circular v-else indeterminate size="18" color="white" width="2" />
        </v-btn>
        <v-btn text @click="close">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { buscarAlumnos, crearMatricula } from '@/apis/matriculas';

export default {
  name: 'FormularioMatricula',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:open', 'created'],
  data() {
    return {
      valid: false,
      form: {
        alumno_id: null,
        anio_lectivo: null,
        grado: null,
        codigo: null
      },
      alumnosOptions: [],
      searchQuery: '',
      loadingAlumnos: false,
      searchTimeout: null,
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
      if (val) this.init()
    },
    searchQuery(val) {
      // Implementar debounce de 300ms para búsqueda remota
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      if (!val || val.length < 2) {
        this.alumnosOptions = []
        return
      }
      
      this.searchTimeout = setTimeout(() => {
        this.buscarAlumnosRemoto(val)
      }, 300)
    }
  },
  methods: {
    close() {
      this.$emit('update:open', false)
      this.resetForm()
    },
    async init() {
      this.resetForm()
    },
    resetForm() {
      this.form = {
        alumno_id: null,
        anio_lectivo: null,
        grado: null,
        codigo: null
      }
      this.alumnosOptions = []
      this.searchQuery = ''
      this.fieldErrors = {}
    },
    async buscarAlumnosRemoto(query) {
      console.log('🔍 Buscando alumnos con query:', query)
      this.loadingAlumnos = true
      try {
        const results = await buscarAlumnos(query, 10)
        console.log('✅ Resultados recibidos:', results)
        // Backend devuelve { id, nie, nombres, apellidos, nombre_completo }
        this.alumnosOptions = (results || []).map(item => ({
          ...item,
          nombre_completo: item.nombre_completo || `${item.nombres ?? ''} ${item.apellidos ?? ''}`.trim(),
        }))
        console.log('📋 Opciones disponibles:', this.alumnosOptions)
      } catch (error) {
        console.error('❌ Error al buscar alumnos:', error)
        console.error('Detalles del error:', error.response?.data)
        this.alumnosOptions = []
      } finally {
        this.loadingAlumnos = false
      }
    },
    async submit() {
      this.fieldErrors = {}
      if (this.$refs.form.validate()) {
        this.submitting = true
        try {
          const res = await crearMatricula(this.form)
          // res tiene { message, ... }
          this.$emit('created', res)
          this.$emit('update:open', false)
          this.resetForm()
        } catch (error) {
          console.error('Error al crear matricula', error)
          const resp = error.response && error.response.data ? error.response.data : null
          if (resp && resp.errors) {
            // validation errors 422
            this.fieldErrors = resp.errors || {}
            this.$emit('created', { success: false, message: resp.message || 'Error de validación', errors: resp.errors })
          } else {
            const msg = resp && resp.message ? resp.message : 'Error al crear matrícula'
            this.$emit('created', { success: false, message: msg })
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
/* small spacing or overrides */
</style>
