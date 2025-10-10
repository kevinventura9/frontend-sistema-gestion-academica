<script setup>
import { registrarUsuario } from '@/api/usuarios'
import { useValidaciones } from '@/composables/useValidaciones'
import { useAlertStore } from '@/stores/alertas'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'

// Props del modal
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Emits para el modal
const emit = defineEmits(['update:isVisible', 'usuario-creado'])

// Store de alertas
const alertStore = useAlertStore()

// Store de autenticación
const authStore = useAuthStore()

// Composable de validaciones
const {
  formErrors,
  limpiarErrores,
  obtenerError,
  ejecutarValidacion,
  validarEmail,
  validarDUI,
  validarTelefono,
  validarFechaNacimiento,
  formatearDUI,
  formatearTelefono,
  rolesOptions,
  estadoOptions
} = useValidaciones()

// Referencias reactivas para el formulario
const email = ref('')
const password = ref('')
const dui = ref('')
const nombre_completo = ref('')
const fecha_nacimiento = ref('')
const telefono = ref('')
const rol = ref('')
const estado = ref('activo')

// Estados para el formulario
const loading = ref(false)

// Opciones de rol filtradas según el usuario autenticado
const rolesDisponibles = computed(() => {
  const userRole = authStore.getUser?.rol
  
  if (userRole === 'director') {
    // El director puede crear cualquier tipo de usuario
    return rolesOptions
  } else if (userRole === 'administrador_academico') {
    // El administrador académico solo puede crear docentes
    return rolesOptions.filter(rol => rol.value === 'docente')
  }
  
  // Por defecto, si no hay rol definido o es otro rol, no puede crear usuarios
  return []
})

// Función para cerrar el modal
const cerrarModal = () => {
  limpiarFormulario()
  limpiarErrores()
  emit('update:isVisible', false)
}

// Función para enviar el formulario
const enviarFormulario = async () => {
  // Crear objeto con los datos del formulario
  const datosFormulario = {
    email: email.value,
    password: password.value,
    dui: dui.value,
    nombre_completo: nombre_completo.value,
    fecha_nacimiento: fecha_nacimiento.value,
    telefono: telefono.value,
    rol: rol.value,
    estado: estado.value
  }
  
  // Validar usando el composable (incluir password = true)
  if (!ejecutarValidacion(datosFormulario, true)) {
    return
  }
  
  loading.value = true
  
  try {
    const response = await registrarUsuario(datosFormulario)
    
    // Éxito - mostrar alerta y cerrar modal
    alertStore.showAlert({
      message: response.message,
      type: 'success'
    })
    emit('usuario-creado', response.usuario)
    cerrarModal()
    
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    
    // Manejar errores de validación del servidor
    if (error.errors) {
      formErrors.value = error.errors
    } 
  } finally {
    loading.value = false
  }
}

// Función para limpiar el formulario
const limpiarFormulario = () => {
  email.value = ''
  password.value = ''
  dui.value = ''
  nombre_completo.value = ''
  fecha_nacimiento.value = ''
  telefono.value = ''
  rol.value = ''
  estado.value = 'activo'
}

// Funciones de formateo con manejo de eventos
const manejarFormatearDUI = (event) => {
  dui.value = formatearDUI(event.target.value)
}

const manejarFormatearTelefono = (event) => {
  telefono.value = formatearTelefono(event.target.value)
}

// Funciones de validación en tiempo real
const manejarValidarEmail = () => {
  validarEmail(email.value)
}

const manejarValidarDUI = () => {
  validarDUI(dui.value)
}

const manejarValidarTelefono = () => {
  validarTelefono(telefono.value)
}

const manejarValidarFechaNacimiento = () => {
  validarFechaNacimiento(fecha_nacimiento.value)
}
</script>

<template>
  <VDialog 
    :model-value="isVisible"
    @update:model-value="cerrarModal"
    width="60%"
    max-width="90%"
    persistent
  >
    <VCard class="pa-sm-11 pa-3" style="max-block-size: 80vh; overflow-y: auto;">
      <!-- Botón de cerrar (posición absoluta) -->
      <VBtn
        icon
        variant="text"
        class="v-dialog-close-btn"
        style="position: absolute; z-index: 1; inset-block-start: 16px; inset-inline-end: 16px;"
        :disabled="loading"
        @click="cerrarModal"
      >
        <VIcon icon="ri-close-line" />
      </VBtn>

      <!-- Contenido completo del modal -->
      <div class="pt-5">
        <!-- Título centrado -->
        <div class="text-center pb-6">
          <h4 class="text-h4 mb-2">Añadir Usuario</h4>
          <div class="text-body-1">Complete la información del nuevo usuario</div>
        </div>

        <!-- Formulario -->
        <VForm class="mt-4" @submit.prevent="enviarFormulario">
          <VRow>
            <!-- Nombre Completo -->
            <VCol cols="12">
              <VTextField
                v-model="nombre_completo"
                label="Nombre Completo"
                placeholder="Juan Pérez García"
                variant="outlined"
                density="comfortable"
                :error-messages="obtenerError('nombre_completo')"
                :disabled="loading"
              />
            </VCol>

            <!-- Email -->
            <VCol cols="12">
              <VTextField
                v-model="email"
                label="Email"
                type="email"
                placeholder="usuario@ejemplo.com"
                variant="outlined"
                density="comfortable"
                :error-messages="obtenerError('email')"
                :disabled="loading"
                @blur="manejarValidarEmail"
              />
            </VCol>

            <!-- DUI y Teléfono -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="dui"
                label="DUI"
                placeholder="12345678-9"
                variant="outlined"
                density="comfortable"
                :error-messages="obtenerError('dui')"
                :disabled="loading"
                maxlength="10"
                @input="manejarFormatearDUI"
                @blur="manejarValidarDUI"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="telefono"
                label="Teléfono"
                placeholder="12345678"
                variant="outlined"
                density="comfortable"
                :error-messages="obtenerError('telefono')"
                :disabled="loading"
                maxlength="8"
                @input="manejarFormatearTelefono"
                @blur="manejarValidarTelefono"
              />
            </VCol>

            <!-- Contraseña -->
            <VCol cols="12">
              <VTextField
                v-model="password"
                label="Contraseña"
                placeholder="············"
                variant="outlined"
                density="comfortable"
                :error-messages="obtenerError('password')"
                :disabled="loading"
              />
            </VCol>

            <!-- Fecha de Nacimiento -->
            <VCol cols="12">
              <VTextField
                v-model="fecha_nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                variant="outlined"
                density="comfortable"
                :error-messages="obtenerError('fecha_nacimiento')"
                :disabled="loading"
                @blur="manejarValidarFechaNacimiento"
              />
            </VCol>

            <!-- Rol y Estado -->
            <VCol cols="12" md="6">
              <VSelect
                v-model="rol"
                label="Rol"
                :items="rolesDisponibles"
                placeholder="Seleccionar rol"
                variant="outlined"
                density="comfortable"
                :error-messages="obtenerError('rol')"
                :disabled="loading"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect
                v-model="estado"
                label="Estado"
                :items="estadoOptions"
                variant="outlined"
                density="comfortable"
                :error-messages="obtenerError('estado')"
                :disabled="loading"
              />
            </VCol>

            <!-- Botones centrados -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="loading"
                @click="enviarFormulario"
              >
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </VBtn>
              <VBtn
                variant="outlined"
                :disabled="loading"
                @click="cerrarModal"
              >
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </div>
    </VCard>
  </VDialog>
</template>


