<script setup>
import { actualizarAlumno, getAlumnoPorId } from '@/api/alumnos'
import { useAlertStore } from '@/stores/alertas'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  alumnoId: {
    type: [String, Number],
    default: null,
  },
  esMiPerfil: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['alumno-cargado'])

const alertStore = useAlertStore()
const loading = ref(false)
const saving = ref(false)
const alumnoActual = ref(null)
const formErrors = reactive({})

const defaultState = () => ({
  nie: '',
  nombres: '',
  apellidos: '',
  fecha_nacimiento: '',
  sexo: '',
  direccion: '',
  departamento: '',
  municipio: '',
})

const formState = reactive(defaultState())

const sexoOptions = [
  { value: 'masculino', title: 'Masculino' },
  { value: 'femenino', title: 'Femenino' },
  { value: 'otro', title: 'Otro' },
]

const normalizarFecha = valor => {
  if (!valor) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor
  const fecha = new Date(valor)
  if (Number.isNaN(fecha)) return ''
  const year = fecha.getUTCFullYear()
  const month = String(fecha.getUTCMonth() + 1).padStart(2, '0')
  const day = String(fecha.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const edadCalculada = computed(() => {
  if (!formState.fecha_nacimiento) return '—'
  const partes = formState.fecha_nacimiento.split('-').map(Number)
  if (partes.length !== 3 || partes.some(Number.isNaN)) return '—'
  const [year, month, day] = partes
  const hoy = new Date()
  let edad = hoy.getFullYear() - year
  const mesActual = hoy.getMonth() + 1
  const diaActual = hoy.getDate()
  if (mesActual < month || (mesActual === month && diaActual < day)) edad -= 1
  if (edad < 0 || Number.isNaN(edad)) return '—'
  return `${edad} años`
})

const nombreCompleto = computed(() => `${formState.nombres} ${formState.apellidos}`.trim() || 'Alumno sin nombre')

const iniciales = computed(() =>
  nombreCompleto.value
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AL',
)

const limpiarErrores = () => {
  Object.keys(formErrors).forEach(key => delete formErrors[key])
}

const setErroresServidor = errores => {
  limpiarErrores()
  Object.entries(errores || {}).forEach(([campo, mensajes]) => {
    formErrors[campo] = mensajes?.[0] ?? 'Campo inválido'
  })
}

const asignarFormulario = datos => {
  Object.assign(formState, defaultState())
  Object.keys(formState).forEach(key => {
    formState[key] = key === 'fecha_nacimiento' ? normalizarFecha(datos?.[key]) : datos?.[key] ?? ''
  })
}

const loadAlumno = async () => {
  if (!props.alumnoId) {
    emit('alumno-cargado', false)
    return
  }

  loading.value = true
  try {
    const response = await getAlumnoPorId(props.alumnoId)
    alumnoActual.value = response?.data
    asignarFormulario(alumnoActual.value)
    emit('alumno-cargado', true)
  } catch (error) {
    alertStore.showAlert({
      type: 'error',
      message: error?.error || 'No se pudo cargar la información del alumno',
    })
    emit('alumno-cargado', false)
  } finally {
    loading.value = false
  }
}

const validarFormulario = () => {
  limpiarErrores()
  if (!formState.nombres.trim()) formErrors.nombres = 'Ingresa los nombres'
  if (!formState.apellidos.trim()) formErrors.apellidos = 'Ingresa los apellidos'
  if (!formState.fecha_nacimiento) formErrors.fecha_nacimiento = 'Selecciona la fecha de nacimiento'
  if (!formState.sexo) formErrors.sexo = 'Selecciona el sexo'
  return Object.keys(formErrors).length === 0
}

const saveChanges = async () => {
  if (!props.alumnoId || !validarFormulario()) return

  saving.value = true
  try {
    const response = await actualizarAlumno(props.alumnoId, formState)
    alumnoActual.value = response?.data
    asignarFormulario(alumnoActual.value)
    alertStore.showAlert({
      type: 'success',
      message: response?.message || 'Alumno actualizado correctamente',
    })
  } catch (error) {
    if (error?.errors) {
      setErroresServidor(error.errors)
    }
    alertStore.showAlert({
      type: 'error',
      message: error?.error || 'No se pudieron guardar los cambios',
    })
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  if (alumnoActual.value) {
    asignarFormulario(alumnoActual.value)
    limpiarErrores()
  }
}

watch(
  () => [props.alumnoId, props.esMiPerfil],
  () => {
    loadAlumno()
  },
  { immediate: true },
)
</script>

<template>
  <VCard>
    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <template v-else>
      <VCardItem>
        <VCardTitle>Datos personales</VCardTitle>
      </VCardItem>

      <VCardText v-if="props.alumnoId" class="d-flex flex-wrap gap-6">
        <VAvatar size="96" color="primary" variant="tonal">
          <span class="text-h4 font-weight-medium">{{ iniciales }}</span>
        </VAvatar>

        <div class="d-flex flex-column justify-center gap-2">
          <div>
            <h5 class="text-h5 mb-1">{{ nombreCompleto }}</h5>
            <div class="text-body-2 text-medium-emphasis">NIE: {{ formState.nie || 'Sin asignar' }}</div>
          </div>

          <div class="d-flex flex-wrap gap-4">
            <div>
              <span class="text-caption text-medium-emphasis">Sexo</span>
              <p class="text-body-1 mb-0 text-capitalize">{{ formState.sexo || 'N/D' }}</p>
            </div>
            <div>
              <span class="text-caption text-medium-emphasis">Edad</span>
              <p class="text-body-1 mb-0">{{ edadCalculada }}</p>
            </div>
          </div>
        </div>
      </VCardText>

      <VCardText v-else class="text-center">
        <VIcon icon="ri-error-warning-line" size="32" class="mb-2" />
        <p class="text-body-2">Selecciona un alumno para visualizar sus datos.</p>
      </VCardText>

      <VDivider />

      <VCardText>
        <VForm>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="formState.nombres" label="Nombres" :disabled="saving" :error-messages="formErrors.nombres" />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="formState.apellidos" label="Apellidos" :disabled="saving" :error-messages="formErrors.apellidos" />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formState.fecha_nacimiento"
                type="date"
                label="Fecha de nacimiento"
                :disabled="saving"
                :error-messages="formErrors.fecha_nacimiento"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VSelect
                v-model="formState.sexo"
                :items="sexoOptions"
                item-title="title"
                item-value="value"
                label="Sexo"
                :disabled="saving"
                :error-messages="formErrors.sexo"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField v-model="formState.nie" label="NIE" :disabled="saving" :error-messages="formErrors.nie" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formState.direccion" label="Dirección" :disabled="saving" />
            </VCol>
            <VCol cols="12" md="3">
              <VTextField v-model="formState.departamento" label="Departamento" :disabled="saving" />
            </VCol>
            <VCol cols="12" md="3">
              <VTextField v-model="formState.municipio" label="Municipio" :disabled="saving" />
            </VCol>

            <VCol cols="12" class="d-flex flex-wrap gap-3">
              <VBtn color="primary" :loading="saving" :disabled="saving || !props.alumnoId" @click="saveChanges">
                Guardar cambios
              </VBtn>
              <VBtn variant="text" :disabled="saving" @click="resetForm">
                Restablecer
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </template>
  </VCard>
</template>
