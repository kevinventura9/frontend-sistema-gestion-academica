<script setup>
import { actualizarAlumno, getAlumnoPorId } from '@/api/alumnos'
import { useAlertStore } from '@/stores/alertas'
import { reactive, ref, watch } from 'vue'

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

const alertStore = useAlertStore()
const loading = ref(false)
const saving = ref(false)
const formErrors = reactive({})

const defaultState = () => ({
  nombre_responsable: '',
  parentesco_responsable: '',
  telefono_responsable: '',
  correo_responsable: '',
  direccion_responsable: '',
})

const formState = reactive(defaultState())
const originalResponsable = ref(defaultState())

const parentescoOptions = ['Madre', 'Padre', 'Encargado', 'Tutor legal', 'Otro']

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
    formState[key] = datos?.[key] ?? ''
  })
}

const guardarOriginal = datos => {
  originalResponsable.value = {
    nombre_responsable: datos?.nombre_responsable ?? '',
    parentesco_responsable: datos?.parentesco_responsable ?? '',
    telefono_responsable: datos?.telefono_responsable ?? '',
    correo_responsable: datos?.correo_responsable ?? '',
    direccion_responsable: datos?.direccion_responsable ?? '',
  }
}

const loadResponsable = async () => {
  if (!props.alumnoId) return

  loading.value = true
  try {
    const response = await getAlumnoPorId(props.alumnoId)
    asignarFormulario(response?.data)
    guardarOriginal(response?.data)
  } catch (error) {
    alertStore.showAlert({
      type: 'warning',
      message: error?.error || 'No se pudo obtener la información del responsable',
    })
  } finally {
    loading.value = false
  }
}

const validarFormulario = () => {
  limpiarErrores()
  if (!formState.nombre_responsable.trim()) formErrors.nombre_responsable = 'Ingresa el nombre del responsable'
  if (!formState.parentesco_responsable.trim()) formErrors.parentesco_responsable = 'Selecciona el parentesco'
  if (!formState.telefono_responsable.trim()) formErrors.telefono_responsable = 'Ingresa el teléfono'
  return Object.keys(formErrors).length === 0
}

const guardarResponsable = async () => {
  if (!props.alumnoId || !validarFormulario()) return

  saving.value = true
  try {
    const response = await actualizarAlumno(props.alumnoId, formState)
    asignarFormulario(response?.data)
    guardarOriginal(response?.data)
    alertStore.showAlert({
      type: 'success',
      message: response?.message || 'Responsable actualizado correctamente',
    })
  } catch (error) {
    if (error?.errors) setErroresServidor(error.errors)
    alertStore.showAlert({
      type: 'error',
      message: error?.error || 'No se pudo actualizar el responsable',
    })
  } finally {
    saving.value = false
  }
}

const restaurarFormulario = () => {
  asignarFormulario(originalResponsable.value)
}

const copiarTelefono = numero => {
  if (!numero) return
  navigator.clipboard?.writeText(numero)
  alertStore.showAlert({
    type: 'info',
    message: 'Teléfono copiado al portapapeles',
  })
}

watch(
  () => [props.alumnoId, props.esMiPerfil],
  () => {
    loadResponsable()
  },
  { immediate: true },
)
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Responsable</VCardTitle>
      <VCardSubtitle>Información de contacto y edición</VCardSubtitle>
    </VCardItem>

    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <VCardText v-else>
      <VRow v-if="formState.nombre_responsable || props.alumnoId">
        <VCol cols="12" md="6">
          <VSheet rounded="lg" class="pa-4" color="primary" variant="tonal">
            <div class="text-overline mb-2">Responsable principal</div>
            <div class="text-h6 mb-1">{{ formState.nombre_responsable || 'Sin registro' }}</div>
            <p class="text-caption mb-4">{{ formState.parentesco_responsable || '—' }}</p>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex align-center gap-2">
                <VIcon icon="ri-phone-line" size="18" />
                <span>{{ formState.telefono_responsable || '—' }}</span>
                <VBtn
                  icon
                  variant="text"
                  size="x-small"
                  :disabled="!formState.telefono_responsable"
                  @click="copiarTelefono(formState.telefono_responsable)"
                >
                  <VIcon icon="ri-file-copy-line" size="16" />
                </VBtn>
              </div>
              <div class="d-flex align-center gap-2">
                <VIcon icon="ri-mail-line" size="18" />
                <span>{{ formState.correo_responsable || '—' }}</span>
              </div>
            </div>
          </VSheet>
        </VCol>

        <VCol cols="12" md="6">
          <VSheet rounded="lg" class="pa-4" color="warning" variant="tonal">
            <div class="text-overline mb-2">Dirección</div>
            <div class="text-body-1 font-weight-medium mb-1">
              {{ formState.direccion_responsable || 'Sin dirección asignada' }}
            </div>
            <p class="text-caption text-medium-emphasis mb-0">
              Mantén esta información actualizada para notificaciones y visitas.
            </p>
          </VSheet>
        </VCol>
      </VRow>

      <div v-else class="text-center text-medium-emphasis py-6">
        No existe información de responsable asociada.
      </div>

      <VDivider class="my-6" />

      <VForm>
        <VRow>
          <VCol cols="12" md="6">
            <VTextField
              v-model="formState.nombre_responsable"
              label="Nombre completo"
              :disabled="saving"
              :error-messages="formErrors.nombre_responsable"
            />
          </VCol>
          <VCol cols="12" md="6">
            <VSelect
              v-model="formState.parentesco_responsable"
              :items="parentescoOptions"
              label="Parentesco"
              :disabled="saving"
              :error-messages="formErrors.parentesco_responsable"
            />
          </VCol>
          <VCol cols="12" md="4">
            <VTextField
              v-model="formState.telefono_responsable"
              label="Teléfono"
              maxlength="8"
              :disabled="saving"
              :error-messages="formErrors.telefono_responsable"
              @input="formState.telefono_responsable = formState.telefono_responsable.replace(/[^\d]/g, '').slice(0, 8)"
            />
          </VCol>
          <VCol cols="12" md="4">
            <VTextField v-model="formState.correo_responsable" label="Correo" type="email" :disabled="saving" />
          </VCol>
          <VCol cols="12" md="4">
            <VTextField v-model="formState.direccion_responsable" label="Dirección" :disabled="saving" />
          </VCol>

          <VCol cols="12" class="d-flex flex-wrap gap-3">
            <VBtn color="primary" :loading="saving" :disabled="saving || !props.alumnoId" @click="guardarResponsable">
              Guardar cambios
            </VBtn>
            <VBtn variant="text" :disabled="saving" @click="restaurarFormulario">
              Restablecer
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
