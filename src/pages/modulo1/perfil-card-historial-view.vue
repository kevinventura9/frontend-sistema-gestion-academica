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

// Función para formatear fecha y hora
const formatearFechaHora = (fechaISO) => {
  if (!fechaISO) return 'No disponible'
  const fecha = new Date(fechaISO)
  return fecha.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Función para formatear solo fecha
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'No disponible'
  const fecha = new Date(fechaISO)
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Computed para calcular la antigüedad del usuario
const antiguedadUsuario = computed(() => {
  if (!usuario.value?.created_at) return 'No disponible'
  const fechaCreacion = new Date(usuario.value.created_at)
  const ahora = new Date()
  const diferencia = ahora - fechaCreacion
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  
  if (dias === 0) return 'Hoy'
  if (dias === 1) return '1 día'
  if (dias < 30) return `${dias} días`
  if (dias < 365) return `${Math.floor(dias / 30)} ${Math.floor(dias / 30) === 1 ? 'mes' : 'meses'}`
  return `${Math.floor(dias / 365)} ${Math.floor(dias / 365) === 1 ? 'año' : 'años'}`
})

// Función para cargar datos del usuario por ID
const cargarUsuario = async () => {
  if (!props.userId) {
    usuario.value = null
    return
  }
  
  try {
    loading.value = true
    const response = await getUsuarioPorId(props.userId)
    usuario.value = response.usuario
  } catch (error) {
    console.error('Error al cargar usuario:', error)
    alertStore.showAlert({
      message: error.message || error.error || 'Error al cargar los datos del usuario',
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

// Lifecycle
onMounted(() => {
  cargarUsuario()
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- Mensaje cuando no hay userId -->
      <VCard v-if="!userId" title="Historial de Usuario">
        <VCardText class="text-center py-8">
          <VIcon
            icon="ri-information-line"
            size="64"
            color="info"
            class="mb-4"
          />
          <h6 class="text-h6 mb-2">
            Sin información de historial
          </h6>
          <p class="text-body-1 text-medium-emphasis">
            Selecciona un usuario específico para ver su historial de auditoría
          </p>
        </VCardText>
      </VCard>

      <!-- Card de Auditoría del Usuario -->
      <VCard v-else title="Historial y Auditoría de Usuario">
        <!-- Indicador de carga -->
        <VProgressLinear
          v-if="loading"
          indeterminate
          color="primary"
        />
        
        <!-- Contenido principal -->
        <VCardText v-if="!loading && usuario">
          <VRow>
            <!-- Información de Creación -->
            <VCol cols="12" md="6">
              <VCard
                variant="outlined"
                class="h-100"
              >
                <VCardItem>
                  <VCardTitle class="d-flex align-center gap-2">
                    <VIcon
                      icon="ri-user-add-line"
                      color="success"
                      size="24"
                    />
                    Registro de Usuario
                  </VCardTitle>
                </VCardItem>
                
                <VCardText>
                  <VList density="compact">
                    <VListItem>
                      <VListItemTitle class="text-sm font-weight-medium">
                        Fecha de Creación
                      </VListItemTitle>
                      <VListItemSubtitle class="text-body-2">
                        {{ formatearFechaHora(usuario.created_at) }}
                      </VListItemSubtitle>
                    </VListItem>
                    
                    <VListItem>
                      <VListItemTitle class="text-sm font-weight-medium">
                        Antigüedad en el Sistema
                      </VListItemTitle>
                      <VListItemSubtitle class="text-body-2">
                        {{ antiguedadUsuario }}
                      </VListItemSubtitle>
                    </VListItem>
                  </VList>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Información de Última Actualización -->
            <VCol cols="12" md="6">
              <VCard
                variant="outlined"
                class="h-100"
              >
                <VCardItem>
                  <VCardTitle class="d-flex align-center gap-2">
                    <VIcon
                      icon="ri-edit-line"
                      color="warning"
                      size="24"
                    />
                    Última Modificación
                  </VCardTitle>
                </VCardItem>
                
                <VCardText>
                  <VList density="compact">
                    <VListItem>
                      <VListItemTitle class="text-sm font-weight-medium">
                        Fecha de Actualización
                      </VListItemTitle>
                      <VListItemSubtitle class="text-body-2">
                        {{ formatearFechaHora(usuario.updated_at) }}
                      </VListItemSubtitle>
                    </VListItem>
                    
                    <VListItem>
                      <VListItemTitle class="text-sm font-weight-medium">
                        Estado Actual
                      </VListItemTitle>
                      <VListItemSubtitle>
                        <VChip
                          :color="usuario.estado === 'activo' ? 'success' : 'secondary'"
                          size="small"
                          variant="tonal"
                          class="text-capitalize"
                        >
                          {{ usuario.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                        </VChip>
                      </VListItemSubtitle>
                    </VListItem>
                    
                    <VListItem>
                      <VListItemTitle class="text-sm font-weight-medium">
                        Rol Actual
                      </VListItemTitle>
                      <VListItemSubtitle>
                        <VChip
                          color="info"
                          size="small"
                          variant="tonal"
                          class="text-capitalize"
                        >
                          {{ usuario.rol === 'administrador_academico' ? 'Administrador' : usuario.rol }}
                        </VChip>
                      </VListItemSubtitle>
                    </VListItem>
                  </VList>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Resumen de Datos -->
            <VCol cols="12">
              <VCard variant="outlined">
                <VCardItem>
                  <VCardTitle class="d-flex align-center gap-2">
                    <VIcon
                      icon="ri-database-line"
                      color="info"
                      size="24"
                    />
                    Resumen de Datos del Usuario
                  </VCardTitle>
                </VCardItem>
                
                <VCardText>
                  <VRow>
                    <VCol cols="12" sm="6" md="3">
                      <div class="text-center">
                        <VIcon
                          icon="ri-user-line"
                          size="32"
                          color="primary"
                          class="mb-2"
                        />
                        <div class="text-sm font-weight-medium">ID de Usuario</div>
                        <div class="text-h6">{{ usuario.id }}</div>
                      </div>
                    </VCol>
                    
                    <VCol cols="12" sm="6" md="3">
                      <div class="text-center">
                        <VIcon
                          icon="ri-mail-line"
                          size="32"
                          color="info"
                          class="mb-2"
                        />
                        <div class="text-sm font-weight-medium">Email</div>
                        <div class="text-body-2 text-truncate">{{ usuario.email }}</div>
                      </div>
                    </VCol>
                    
                    <VCol cols="12" sm="6" md="3">
                      <div class="text-center">
                        <VIcon
                          icon="ri-id-card-line"
                          size="32"
                          color="warning"
                          class="mb-2"
                        />
                        <div class="text-sm font-weight-medium">DUI</div>
                        <div class="text-h6">{{ usuario.dui }}</div>
                      </div>
                    </VCol>
                    
                    <VCol cols="12" sm="6" md="3">
                      <div class="text-center">
                        <VIcon
                          icon="ri-phone-line"
                          size="32"
                          color="success"
                          class="mb-2"
                        />
                        <div class="text-sm font-weight-medium">Teléfono</div>
                        <div class="text-h6">{{ usuario.telefono }}</div>
                      </div>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
        
        <!-- Estado de carga -->
        <VCardText v-if="loading" class="text-center py-8">
          <VProgressCircular
            indeterminate
            color="primary"
            size="64"
          />
          <div class="mt-4">
            <h6 class="text-h6">Cargando historial del usuario...</h6>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
