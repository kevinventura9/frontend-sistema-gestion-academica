<script setup>
import { registrarUsuario } from '@/api/usuarios'
import { useAlertStore } from '@/stores/alertas'

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
const formErrors = ref({})

// Opciones para los select
const rolesOptions = [
  { value: 'director', title: 'Director' },
  { value: 'docente', title: 'Docente' },
  { value: 'administrador_academico', title: 'Administrador Académico' }
]

const estadoOptions = [
  { value: 'activo', title: 'Activo' },
  { value: 'inactivo', title: 'Inactivo' }
]

// Función para cerrar el modal
const cerrarModal = () => {
  limpiarFormulario()
  limpiarErrores()
  emit('update:isVisible', false)
}

// Función para limpiar errores
const limpiarErrores = () => {
  formErrors.value = {}
}

// Validación básica de campos vacíos y formatos
const validarCamposVacios = () => {
  const errores = {}
  
  // Validar nombre completo
  if (!nombre_completo.value.trim()) {
    errores.nombre_completo = ['El nombre completo es obligatorio']
  }
  
  // Validar email
  if (!email.value.trim()) {
    errores.email = ['El email es obligatorio']
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      errores.email = ['El formato del email no es válido']
    }
  }
  
  // Validar contraseña
  if (!password.value.trim()) {
    errores.password = ['La contraseña es obligatoria']
  }
  
  // Validar DUI
  if (!dui.value.trim()) {
    errores.dui = ['El DUI es obligatorio']
  } else {
    const duiRegex = /^\d{8}-\d$/
    if (!duiRegex.test(dui.value)) {
      errores.dui = ['El formato del DUI debe ser 12345678-9']
    }
  }
  
  // Validar teléfono
  if (!telefono.value.trim()) {
    errores.telefono = ['El teléfono es obligatorio']
  } else {
    const telefonoRegex = /^\d{8}$/
    if (!telefonoRegex.test(telefono.value)) {
      errores.telefono = ['El teléfono debe tener exactamente 8 dígitos']
    }
  }
  
  // Validar fecha de nacimiento
  if (!fecha_nacimiento.value) {
    errores.fecha_nacimiento = ['La fecha de nacimiento es obligatoria']
  } else {
    const fechaNacimiento = new Date(fecha_nacimiento.value)
    const fechaActual = new Date()
    const fechaMinima = new Date()
    fechaMinima.setFullYear(fechaActual.getFullYear() - 100) // No más de 100 años
    
    if (fechaNacimiento > fechaActual) {
      errores.fecha_nacimiento = ['La fecha de nacimiento no puede ser futura']
    } else if (fechaNacimiento < fechaMinima) {
      errores.fecha_nacimiento = ['La fecha de nacimiento no puede ser mayor a 100 años']
    }
  }
  
  // Validar rol
  if (!rol.value) {
    errores.rol = ['El rol es obligatorio']
  }
  
  // Validar estado
  if (!estado.value) {
    errores.estado = ['El estado es obligatorio']
  }
  
  return errores
}

// Función para enviar el formulario
const enviarFormulario = async () => {
  // Limpiar errores previos
  limpiarErrores()
  
  // Validar campos vacíos
  const erroresLocales = validarCamposVacios()
  if (Object.keys(erroresLocales).length > 0) {
    formErrors.value = erroresLocales
    return
  }
  
  loading.value = true
  
  try {
    const datosUsuario = {
      email: email.value,
      password: password.value,
      dui: dui.value,
      nombre_completo: nombre_completo.value,
      fecha_nacimiento: fecha_nacimiento.value,
      telefono: telefono.value,
      rol: rol.value,
      estado: estado.value
    }
    
    const response = await registrarUsuario(datosUsuario)
    
    // Éxito - mostrar alerta y cerrar modal
    alertStore.showAlert({
      message: response.message,
      type: 'success'
    })
    emit('usuario-creado', response.usuario)
    cerrarModal()
    
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    
    // Manejar errores de validación
    if (error.errors) {
      formErrors.value = error.errors
    } else {
      // Error general
      alertStore.showAlert({
        message: error.message || 'Error al registrar usuario',
        type: 'error'
      })
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

// Función para obtener el primer error de un campo
const obtenerError = (campo) => {
  return formErrors.value[campo] ? formErrors.value[campo][0] : ''
}

// Funciones de validación en tiempo real
const validarEmail = () => {
  if (email.value && formErrors.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(email.value)) {
      delete formErrors.value.email
    }
  }
}

const validarDUI = () => {
  if (dui.value && formErrors.value.dui) {
    const duiRegex = /^\d{8}-\d$/
    if (duiRegex.test(dui.value)) {
      delete formErrors.value.dui
    }
  }
}

const validarTelefono = () => {
  if (telefono.value && formErrors.value.telefono) {
    const telefonoRegex = /^\d{8}$/
    if (telefonoRegex.test(telefono.value)) {
      delete formErrors.value.telefono
    }
  }
}

const validarFechaNacimiento = () => {
  if (fecha_nacimiento.value && formErrors.value.fecha_nacimiento) {
    const fechaNacimiento = new Date(fecha_nacimiento.value)
    const fechaActual = new Date()
    const fechaMinima = new Date()
    fechaMinima.setFullYear(fechaActual.getFullYear() - 100)
    
    if (fechaNacimiento <= fechaActual && fechaNacimiento >= fechaMinima) {
      delete formErrors.value.fecha_nacimiento
    }
  }
}

// Funciones de formateo automático
const formatearDUI = (event) => {
  let valor = event.target.value.replace(/\D/g, '') // Solo números
  
  // Limitar a 9 dígitos máximo
  if (valor.length > 9) {
    valor = valor.substring(0, 9)
  }
  
  // Agregar guión antes del último dígito si tiene 9 dígitos
  if (valor.length === 9) {
    valor = valor.substring(0, 8) + '-' + valor.substring(8)
  }
  
  dui.value = valor
}

const formatearTelefono = (event) => {
  let valor = event.target.value.replace(/\D/g, '') // Solo números
  
  // Limitar a 8 dígitos máximo
  if (valor.length > 8) {
    valor = valor.substring(0, 8)
  }
  
  telefono.value = valor
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
                @blur="validarEmail"
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
                @input="formatearDUI"
                @blur="validarDUI"
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
                @input="formatearTelefono"
                @blur="validarTelefono"
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
                @blur="validarFechaNacimiento"
              />
            </VCol>

            <!-- Rol y Estado -->
            <VCol cols="12" md="6">
              <VSelect
                v-model="rol"
                label="Rol"
                :items="rolesOptions"
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


