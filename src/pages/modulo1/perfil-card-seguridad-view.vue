<script setup>
import { actualizarUsuario, actualizarMiPerfil } from '@/api/usuarios'
import { useAlertStore } from '@/stores/alertas'
import { ref } from 'vue'

// Props
const props = defineProps({
  userId: {
    type: [String, Number],
    default: null
  },
  esMiPerfil: {
    type: Boolean,
    default: false
  }
})

// Store de alertas
const alertStore = useAlertStore()

// Estados reactivos
const saving = ref(false)
const isNewPasswordVisible = ref(false)
const newPassword = ref('')
const formErrors = ref({})

// Requerimientos de contraseña (solo informativos)
const passwordRequirements = [
  'La contraseña debe tener al menos 6 caracteres.',
]

// Función para limpiar errores
const limpiarErrores = () => {
  formErrors.value = {}
}

// Función para obtener el primer error de un campo
const obtenerError = (campo) => {
  return formErrors.value[campo] ? formErrors.value[campo][0] : ''
}

// Función para cambiar contraseña
const cambiarPassword = async () => {
  // Limpiar errores previos
  limpiarErrores()
  
  // Validación básica de campos vacíos
  if (!newPassword.value.trim()) {
    alertStore.showAlert({
      message: 'Por favor, ingrese la nueva contraseña',
      type: 'error'
    })
    return
  }
  
  saving.value = true
  
  try {
    // Preparar datos para la contraseña
    const datosPassword = {
      password: newPassword.value
    }
    
    let response
    
    if (props.esMiPerfil) {
      // Actualizar mi perfil
      response = await actualizarMiPerfil(datosPassword)
    } else {
      // Actualizar usuario por ID (funcionalidad existente)
      response = await actualizarUsuario(props.userId, datosPassword)
    }
    
    // Limpiar campos después del éxito
    newPassword.value = ''
    limpiarErrores()
    
    // Mostrar mensaje de éxito
    alertStore.showAlert({
      message: response.message || 'Contraseña actualizada exitosamente',
      type: 'success'
    })
    
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    
    // Manejar errores de validación del servidor
    if (error.errors) {
      formErrors.value = error.errors
    }
    
    // Mostrar mensaje de error
    alertStore.showAlert({
      message: error.message || error.error || 'Error al cambiar la contraseña',
      type: 'error'
    })
    
  } finally {
    saving.value = false
  }
}

// Función para limpiar formulario
const limpiarFormulario = () => {
  newPassword.value = ''
  limpiarErrores()
}
</script>

<template>
  <VRow>
    <!-- SECTION Cambiar Contraseña -->
    <VCol cols="12">
      <VCard title="Cambiar Contraseña">
        <VForm @submit.prevent="cambiarPassword">
          <VCardText class="pt-0">
            <!-- 👉 Nueva Contraseña -->
            <VRow class="mb-3">
              <VCol cols="12">
                <VTextField
                  v-model="newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  label="Nueva Contraseña"
                  placeholder="············"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="obtenerError('password')"
                  :disabled="saving"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>
            </VRow>

            <!-- 👉 Requerimientos de Contraseña -->
            <div class="mb-6">
              <h6 class="text-h6 mb-3">
                Requerimientos de contraseña:
              </h6>
              <ul class="d-flex flex-column gap-y-3">
                <li
                  v-for="item in passwordRequirements"
                  :key="item"
                  class="d-flex"
                >
                  <div>
                    <VIcon
                      size="8"
                      icon="ri-circle-fill"
                      class="me-3"
                    />
                  </div>
                  <span class="text-base">{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- 👉 Botones de Acción -->
            <div class="d-flex flex-wrap gap-4">
              <VBtn
                type="submit"
                color="primary"
                :loading="saving"
                :disabled="saving"
                @click="cambiarPassword"
              >
                Cambiar Contraseña
              </VBtn>

              <VBtn
                variant="outlined"
                color="secondary"
                :disabled="saving"
                @click="limpiarFormulario"
              >
                Limpiar
              </VBtn>
            </div>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>
