<script setup>
import { crearAlumno } from '@/api/alumnos'
import { useAlertStore } from '@/stores/alertas'
import { reactive, ref } from 'vue'

defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:isVisible', 'alumno-creado'])

const alertStore = useAlertStore()
const loading = ref(false)
const formErrors = reactive({})

const form = reactive({
  nie: '',
  nombres: '',
  apellidos: '',
  fecha_nacimiento: '',
  sexo: '',
  direccion: '',
  departamento: '',
  municipio: '',
  nombre_responsable: '',
  parentesco_responsable: '',
  telefono_responsable: '',
  correo_responsable: '',
  direccion_responsable: '',
})

const sexoOptions = [
  { value: 'masculino', title: 'Masculino' },
  { value: 'femenino', title: 'Femenino' },
  { value: 'otro', title: 'Otro' },
]

const parentescoOptions = ['Madre', 'Padre', 'Encargado', 'Tutor legal', 'Otro']

const limpiarErrores = () => {
  Object.keys(formErrors).forEach(key => {
    delete formErrors[key]
  })
}

const setErroresServidor = (errors = {}) => {
  limpiarErrores()
  Object.entries(errors).forEach(([campo, mensajes]) => {
    formErrors[campo] = mensajes?.[0] ?? 'Campo inválido'
  })
}

const validarFormulario = () => {
  limpiarErrores()
  if (!form.nombres.trim()) formErrors.nombres = 'Ingresa los nombres'
  if (!form.apellidos.trim()) formErrors.apellidos = 'Ingresa los apellidos'
  if (!form.fecha_nacimiento) formErrors.fecha_nacimiento = 'Selecciona la fecha de nacimiento'
  if (!form.sexo) formErrors.sexo = 'Selecciona el sexo'
  if (!form.nombre_responsable.trim()) formErrors.nombre_responsable = 'Ingresa el responsable'
  if (!form.parentesco_responsable.trim()) formErrors.parentesco_responsable = 'Ingresa el parentesco'
  if (!form.telefono_responsable.trim()) formErrors.telefono_responsable = 'Ingresa el teléfono del responsable'

  return Object.keys(formErrors).length === 0
}

const closeModal = () => {
  emit('update:isVisible', false)
}

const resetForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  limpiarErrores()
}

const normalizarTelefono = valor => valor.replace(/[^\d]/g, '').slice(0, 8)

const handleSubmit = async () => {
  if (!validarFormulario()) return

  loading.value = true
  try {
    const response = await crearAlumno({ ...form, telefono_responsable: normalizarTelefono(form.telefono_responsable) })
    alertStore.showAlert({
      type: 'success',
      message: response?.message || 'Alumno creado correctamente',
    })
    emit('alumno-creado', response?.data)
    resetForm()
    closeModal()
  } catch (error) {
    if (error?.errors) {
      setErroresServidor(error.errors)
    }
    alertStore.showAlert({
      type: 'error',
      message: error?.error || 'No se pudo registrar al alumno',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <VDialog
    :model-value="isVisible"
    width="720"
    persistent
    @update:model-value="closeModal"
  >
    <VCard class="pa-sm-8 pa-4">
      <VBtn
        icon
        variant="text"
        class="v-dialog-close-btn"
        style="position: absolute; inset-block-start: 16px; inset-inline-end: 16px;"
        :disabled="loading"
        @click="closeModal"
      >
        <VIcon icon="ri-close-line" />
      </VBtn>

      <div class="text-center pb-4">
        <h4 class="text-h4 mb-1">Registrar alumno</h4>
        <p class="text-body-2 text-medium-emphasis">Campos obligatorios marcados con *</p>
      </div>

      <VForm @submit.prevent="handleSubmit">
        <VRow>
          <VCol cols="12" md="6">
            <VTextField
              v-model="form.nombres"
              label="Nombres *"
              variant="outlined"
              :error-messages="formErrors.nombres"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.apellidos"
              label="Apellidos *"
              variant="outlined"
              :error-messages="formErrors.apellidos"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.fecha_nacimiento"
              type="date"
              label="Fecha de nacimiento *"
              variant="outlined"
              :error-messages="formErrors.fecha_nacimiento"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VSelect
              v-model="form.sexo"
              :items="sexoOptions"
              item-title="title"
              item-value="value"
              label="Sexo *"
              variant="outlined"
              :error-messages="formErrors.sexo"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.nie"
              label="NIE"
              variant="outlined"
              :error-messages="formErrors.nie"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.direccion"
              label="Dirección"
              variant="outlined"
              :error-messages="formErrors.direccion"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.departamento"
              label="Departamento"
              variant="outlined"
              :error-messages="formErrors.departamento"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.municipio"
              label="Municipio"
              variant="outlined"
              :error-messages="formErrors.municipio"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12">
            <VDivider class="my-2" />
            <p class="text-subtitle-2 mb-1">Datos del responsable</p>
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.nombre_responsable"
              label="Nombre completo responsable *"
              variant="outlined"
              :error-messages="formErrors.nombre_responsable"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VSelect
              v-model="form.parentesco_responsable"
              :items="parentescoOptions"
              label="Parentesco *"
              variant="outlined"
              :error-messages="formErrors.parentesco_responsable"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.telefono_responsable"
              label="Teléfono responsable *"
              variant="outlined"
              maxlength="8"
              :error-messages="formErrors.telefono_responsable"
              :disabled="loading"
              @input="form.telefono_responsable = form.telefono_responsable.replace(/[^\d]/g, '').slice(0, 8)"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.correo_responsable"
              label="Correo responsable"
              type="email"
              variant="outlined"
              :error-messages="formErrors.correo_responsable"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12">
            <VTextField
              v-model="form.direccion_responsable"
              label="Dirección responsable"
              variant="outlined"
              :error-messages="formErrors.direccion_responsable"
              :disabled="loading"
            />
          </VCol>

          <VCol cols="12" class="d-flex justify-center gap-4">
            <VBtn color="primary" :loading="loading" :disabled="loading" @click="handleSubmit">
              Guardar
            </VBtn>
            <VBtn
              variant="outlined"
              :disabled="loading"
              @click="resetForm"
            >
              Limpiar
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
  </VDialog>
</template>
