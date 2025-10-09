<script setup>
import { getUsuarioPorId } from '@/api/usuarios'
import { useAlertStore } from '@/stores/alertas'
import { computed, onMounted, ref, watch } from 'vue'

// Props
const props = defineProps({
  userId: {
    type: [String, Number],
    default: null
  }
})

// Store de alertas
const alertStore = useAlertStore()

// Estados reactivos
const loading = ref(false)
const usuario = ref(null)

// Datos por defecto (para cuando no hay userId - vista de perfil personal)
const defaultAccountData = {
  nombre_completo: 'Juan Pérez García',
  email: 'juan.perez@ejemplo.com',
  dui: '12345678-9',
  telefono: '12345678',
  fecha_nacimiento: '1990-01-15',
  rol: 'docente',
  estado: 'activo',
}

const accountDataLocal = ref(structuredClone(defaultAccountData))

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
  if (!props.userId) {
    // Si no hay userId, usar datos por defecto (perfil personal)
    accountDataLocal.value = structuredClone(defaultAccountData)
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
  } catch (error) {
    console.error('Error al cargar usuario:', error)
    alertStore.showAlert({
      message: error.message || 'Error al cargar los datos del usuario',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Watcher para recargar cuando cambie el userId
watch(() => props.userId, () => {
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
    accountDataLocal.value = structuredClone(usuario.value)
  } else {
    accountDataLocal.value = structuredClone(defaultAccountData)
  }
}

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

// Función para guardar cambios (simulada)
const saveChanges = () => {
  console.log('Guardando cambios:', accountDataLocal.value)
  // Aquí iría la lógica para enviar los datos al backend
  alertStore.showAlert({
    message: 'Cambios guardados exitosamente',
    type: 'success'
  })
}

// Computed para el título del card
const cardTitle = computed(() => {
  return props.userId ? 'Editar Usuario' : 'Detalles de la Cuenta'
})

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
        
        <VCardText v-if="!loading" class="d-flex">
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

        <VDivider v-if="!loading" />

        <VCardText v-if="!loading">
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
                />
              </VCol>

              <!-- 👉 Rol -->
              <VCol
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
                />
              </VCol>

              <!-- 👉 Estado -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="accountDataLocal.estado"
                  label="Estado"
                  :items="estadoOptions"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <!-- 👉 Acciones del formulario -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn 
                  color="primary"
                  :loading="loading"
                  @click="saveChanges"
                >
                  Guardar cambios
                </VBtn>
                
                <VBtn
                  v-if="userId"
                  color="info"
                  variant="outlined"
                  :disabled="loading"
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
