<script setup>
import { actualizarUsuario, getUsuarioPorId, getMiPerfil, actualizarMiPerfil } from '@/api/usuarios'
import { useValidaciones } from '@/composables/useValidaciones'
import { useAlertStore } from '@/stores/alertas'
import { computed, onMounted, ref, watch } from 'vue'

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

// Emitir eventos al padre
const emit = defineEmits(['usuarioCargado'])

// Store de alertas
const alertStore = useAlertStore()

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

// Estados reactivos
const loading = ref(false) // Para carga inicial de datos
const saving = ref(false)  // Para operación de guardado
const usuario = ref(null)

const accountDataLocal = ref({})

// Computed para las iniciales del usuario
const userInitials = computed(() => {
  return accountDataLocal.value.nombre_completo
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Función para formatear fecha ISO a formato YYYY-MM-DD
const formatearFechaParaInput = (fechaISO) => {
  if (!fechaISO) return ''
  const fecha = new Date(fechaISO)
  return fecha.toISOString().split('T')[0]
}

// Función para cargar datos del usuario por ID
const cargarUsuario = async () => {
  if (props.esMiPerfil) {
    // Cargar mi perfil
    try {
      loading.value = true
      const response = await getMiPerfil()
      usuario.value = response.usuario
      // Formatear la fecha de nacimiento para el input
      const usuarioFormateado = {
        ...response.usuario,
        fecha_nacimiento: formatearFechaParaInput(response.usuario.fecha_nacimiento)
      }
      accountDataLocal.value = structuredClone(usuarioFormateado)
      emit('usuarioCargado', true) // Emitir evento de usuario cargado
    } catch (error) {
      emit('usuarioCargado', false) // Notificar fallo
      console.error('Error al cargar mi perfil:', error)
      alertStore.showAlert({
        message: error.message || error.error || 'Error al cargar los datos del perfil',
        type: 'error'
      })
    } finally {
      loading.value = false
    }
  } else {
    // Cargar usuario por ID (funcionalidad existente)
    if (!props.userId) {
      emit('usuarioCargado', false)
      return
    }
    
    try {
      loading.value = true
      const response = await getUsuarioPorId(props.userId)
      usuario.value = response.usuario
      // Formatear la fecha de nacimiento para el input
      const usuarioFormateado = {
        ...response.usuario,
        fecha_nacimiento: formatearFechaParaInput(response.usuario.fecha_nacimiento)
      }
      accountDataLocal.value = structuredClone(usuarioFormateado)
      emit('usuarioCargado', true) // Emitir evento de usuario cargado
    } catch (error) {
      emit('usuarioCargado', false) // Notificar fallo
      console.error('Error al cargar usuario:', error)
      alertStore.showAlert({
        message: error.message ||error.error || 'Error al cargar los datos del usuario',
        type: 'error'
      })
    } finally {
      loading.value = false
    }
  }
}

// Watcher para recargar cuando cambie el userId o esMiPerfil
watch(() => [props.userId, props.esMiPerfil], () => {
  cargarUsuario()
}, { immediate: true })

// Función para resolver el color y el icono según el rol
const resolveUserRoleVariant = role => {
  const roleLowerCase = role.toLowerCase()
  if (roleLowerCase === 'docente')
    return {
      color: 'info',
      icon: 'ri-user-line',
    }
  if (roleLowerCase === 'director')
    return {
      color: 'director-purple',
      icon: 'ri-user-star-line',
    }
  if (roleLowerCase === 'administrador_academico')
    return {
      color: 'warning',
      icon: 'ri-admin-line',
    }
  
  return {
    color: 'secondary',
    icon: 'ri-user-line',
  }
}

// Función para resolver el color del estado
const resolveUserStatusVariant = estado => {
  const estadoLowerCase = estado.toLowerCase()
  return estadoLowerCase === 'activo' ? 'success' : 'secondary'
}

// Función para mostrar texto del estado
const getEstadoTexto = (estado) => {
  const estadoLowerCase = estado.toLowerCase()
  return estadoLowerCase === 'activo' ? 'Activo' : 'Inactivo'
}

// Función para mostrar texto del rol
const getRolTexto = (rol) => {
  return rol === 'administrador_academico' ? 'Administrador' : rol.charAt(0).toUpperCase() + rol.slice(1)
}

// Función para resetear el formulario
const resetForm = () => {
  if (usuario.value) {
    const usuarioFormateado = {
      ...usuario.value,
      fecha_nacimiento: formatearFechaParaInput(usuario.value.fecha_nacimiento)
    }
    accountDataLocal.value = structuredClone(usuarioFormateado)
  }
  // Limpiar errores al resetear
  limpiarErrores()
}

// Función para guardar mi perfil (sin rol ni estado)
const guardarMiPerfil = async () => {
  // Validar usando el composable (sin password)
  if (!ejecutarValidacion(accountDataLocal.value, false)) {
    alertStore.showAlert({
      message: 'Por favor, corrija los errores en el formulario',
      type: 'error'
    })
    return
  }

  saving.value = true

  try {
    // Crear objeto con solo los campos permitidos para mi perfil
    const datosParaMiPerfil = {
      nombre_completo: accountDataLocal.value.nombre_completo,
      email: accountDataLocal.value.email,
      dui: accountDataLocal.value.dui,
      telefono: accountDataLocal.value.telefono,
      fecha_nacimiento: accountDataLocal.value.fecha_nacimiento
    }
    
    const response = await actualizarMiPerfil(datosParaMiPerfil)
    
    // Actualizar datos locales solo en caso de éxito
    const usuarioActualizado = {
      ...response.usuario,
      fecha_nacimiento: formatearFechaParaInput(response.usuario.fecha_nacimiento)
    }
    
    // Actualizar tanto usuario como accountDataLocal
    usuario.value = response.usuario
    accountDataLocal.value = structuredClone(usuarioActualizado)
    
    // Limpiar errores después del éxito
    limpiarErrores()
    
    // Mostrar mensaje de éxito
    alertStore.showAlert({
      message: response.message || 'Perfil actualizado exitosamente',
      type: 'success'
    })
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    
    // Manejar errores de validación del servidor
    if (error.errors) {
      formErrors.value = error.errors
    }
    
    // Mostrar mensaje de error
    alertStore.showAlert({
      message: error.error || error.message || 'Error al actualizar el perfil',
      type: 'warning'
    })
    
  } finally {
    saving.value = false
  }
}

// Función para guardar cambios de usuario (edición completa)
const guardarCambiosUsuario = async () => {
  // Validar usando el composable (sin password)
  if (!ejecutarValidacion(accountDataLocal.value, false)) {
    alertStore.showAlert({
      message: 'Por favor, corrija los errores en el formulario',
      type: 'error'
    })
    return
  }

  saving.value = true

  try {
    // Actualizar usuario por ID (funcionalidad existente con todos los campos)
    const response = await actualizarUsuario(props.userId, accountDataLocal.value)
    
    // Actualizar datos locales solo en caso de éxito
    const usuarioActualizado = {
      ...response.usuario,
      fecha_nacimiento: formatearFechaParaInput(response.usuario.fecha_nacimiento)
    }
    
    // Actualizar tanto usuario como accountDataLocal
    usuario.value = response.usuario
    accountDataLocal.value = structuredClone(usuarioActualizado)
    
    // Limpiar errores después del éxito
    limpiarErrores()
    
    // Mostrar mensaje de éxito
    alertStore.showAlert({
      message: response.message,
      type: 'success'
    })
    
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    
    // Manejar error específico del director que no puede cambiar su propio rol
    if (error.error && error.error.includes('director')) {
      // Revertir estado y rol a los valores originales del director
      accountDataLocal.value.estado = 'activo'
      accountDataLocal.value.rol = 'director'
    }
    
    // Manejar errores de validación del servidor
    if (error.errors) {
      formErrors.value = error.errors
    }
    
    // Mostrar mensaje de error
    alertStore.showAlert({
      message: error.error || error.message || 'Error al actualizar el usuario',
      type: 'warning'
    })
    
  } finally {
    saving.value = false
  }
}

// Función unificada para llamar la función correcta según el modo
const saveChanges = async () => {
  if (props.esMiPerfil) {
    await guardarMiPerfil()
  } else {
    await guardarCambiosUsuario()
  }
}

// Funciones de formateo con manejo de eventos
const manejarFormatearDUI = (event) => {
  accountDataLocal.value.dui = formatearDUI(event.target.value)
}

const manejarFormatearTelefono = (event) => {
  accountDataLocal.value.telefono = formatearTelefono(event.target.value)
}

// Funciones de validación en tiempo real
const manejarValidarEmail = () => {
  validarEmail(accountDataLocal.value.email)
}

const manejarValidarDUI = () => {
  validarDUI(accountDataLocal.value.dui)
}

const manejarValidarTelefono = () => {
  validarTelefono(accountDataLocal.value.telefono)
}

const manejarValidarFechaNacimiento = () => {
  validarFechaNacimiento(accountDataLocal.value.fecha_nacimiento)
}

// Computed para el título del card
const cardTitle = computed(() => {
  return props.esMiPerfil ? 'Mi Perfil' : 'Editar usuario'
})

// Computed para acceder a props en template
const esMiPerfil = computed(() => props.esMiPerfil)

// Lifecycle
onMounted(() => {
  cargarUsuario()
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard :title="cardTitle">
        <!-- Indicador de carga -->
        <VProgressLinear
          v-if="loading"
          indeterminate
          color="primary"
        />
        
        <VCardText v-if="!loading && usuario" class="d-flex">
          <!-- 👉 Avatar con iniciales -->
          <VAvatar
            size="100"
            variant="tonal"
            :color="resolveUserRoleVariant(accountDataLocal.rol).color"
            class="me-6"
          >
            <span class="text-h4 font-weight-medium">
              {{ userInitials }}
            </span>
          </VAvatar>

          <!-- 👉 Información del usuario -->
          <div class="d-flex flex-column justify-center gap-3">
            <div>
              <h5 class="text-h5 font-weight-medium mb-1">
                {{ accountDataLocal.nombre_completo }}
              </h5>
              <div class="d-flex align-center gap-2">
                <VIcon
                  :icon="resolveUserRoleVariant(accountDataLocal.rol).icon"
                  :color="resolveUserRoleVariant(accountDataLocal.rol).color"
                  size="24"
                />
                <span class="text-body-1 text-medium-emphasis font-weight-medium">
                  {{ getRolTexto(accountDataLocal.rol) }}
                </span>
              </div>
            </div>

            <div class="d-flex gap-2">
              <VChip
                :color="resolveUserStatusVariant(accountDataLocal.estado)"
                size="default"
                class="text-capitalize font-weight-medium"
              >
                {{ getEstadoTexto(accountDataLocal.estado) }}
              </VChip>
            </div>
          </div>
        </VCardText>

        <VDivider v-if="!loading && usuario" />

        <VCardText v-if="!loading && usuario">
          <!-- 👉 Formulario -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 Nombre Completo -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.nombre_completo"
                  label="Nombre Completo"
                  placeholder="Juan Pérez García"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="obtenerError('nombre_completo')"
                  :disabled="loading || saving"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.email"
                  label="Email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="obtenerError('email')"
                  :disabled="loading || saving"
                  @blur="manejarValidarEmail"
                />
              </VCol>

              <!-- 👉 DUI -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.dui"
                  label="DUI"
                  placeholder="12345678-9"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="obtenerError('dui')"
                  :disabled="loading || saving"
                  maxlength="10"
                  @input="manejarFormatearDUI"
                  @blur="manejarValidarDUI"
                />
              </VCol>

              <!-- 👉 Teléfono -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.telefono"
                  label="Teléfono"
                  placeholder="12345678"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="obtenerError('telefono')"
                  :disabled="loading || saving"
                  maxlength="8"
                  @input="manejarFormatearTelefono"
                  @blur="manejarValidarTelefono"
                />
              </VCol>

              <!-- 👉 Fecha de Nacimiento -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.fecha_nacimiento"
                  label="Fecha de Nacimiento"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="obtenerError('fecha_nacimiento')"
                  :disabled="loading || saving"
                  @blur="manejarValidarFechaNacimiento"
                />
              </VCol>

              <!-- 👉 Rol -->
              <VCol
                v-if="!esMiPerfil"
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="accountDataLocal.rol"
                  label="Rol"
                  :items="rolesOptions"
                  placeholder="Seleccionar rol"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="obtenerError('rol')"
                  :disabled="loading || saving"
                />
              </VCol>

              <!-- 👉 Estado -->
              <VCol
                v-if="!esMiPerfil"
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="accountDataLocal.estado"
                  label="Estado"
                  :items="estadoOptions"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="obtenerError('estado')"
                  :disabled="loading || saving"
                />
              </VCol>

              <!-- 👉 Acciones del formulario -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn 
                  color="primary"
                  :loading="saving"
                  :disabled="saving"
                  @click="saveChanges"
                >
                  Guardar cambios
                </VBtn>
                
                <VBtn
                  v-if="!esMiPerfil"
                  color="info"
                  variant="outlined"
                  :disabled="saving"
                  @click="$router.push('/usuarios')"
                >
                  Volver a la lista
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        
        <!-- Estado de carga -->
        <VCardText v-if="loading" class="text-center py-8">
          <VProgressCircular
            indeterminate
            color="primary"
            size="64"
          />
          <div class="mt-4">
            <h6 class="text-h6">Cargando datos del usuario...</h6>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
