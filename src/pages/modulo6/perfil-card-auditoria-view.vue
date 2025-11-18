<script setup>
import { getAlumnoPorId } from '@/api/alumnos'
import { useAlertStore } from '@/stores/alertas'
import { computed, ref, watch } from 'vue'

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
const alumno = ref(null)

const formatearFechaHora = fechaISO => {
  if (!fechaISO) return 'No disponible'
  const fecha = new Date(fechaISO)
  if (Number.isNaN(fecha)) return 'No disponible'
  return fecha.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const antiguedadAlumno = computed(() => {
  if (!alumno.value?.created_at) return 'No disponible'
  const fechaCreacion = new Date(alumno.value.created_at)
  const ahora = new Date()
  const diferencia = ahora - fechaCreacion
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))

  if (dias <= 0) return 'Hoy'
  if (dias === 1) return '1 día'
  if (dias < 30) return `${dias} días`
  if (dias < 365) {
    const meses = Math.floor(dias / 30)
    return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
  }
  const anios = Math.floor(dias / 365)
  return `${anios} ${anios === 1 ? 'año' : 'años'}`
})

const cargarHistorial = async () => {
  if (!props.alumnoId) {
    alumno.value = null
    return
  }

  loading.value = true
  try {
    const response = await getAlumnoPorId(props.alumnoId)
    alumno.value = response?.data ?? null
  } catch (error) {
    alumno.value = null
    alertStore.showAlert({
      message: error?.error || 'No se pudo obtener el historial del alumno',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.alumnoId, props.esMiPerfil],
  () => {
    cargarHistorial()
  },
  { immediate: true },
)
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Historial del alumno</VCardTitle>
      <VCardSubtitle>Estatus de registro y últimas actualizaciones</VCardSubtitle>
    </VCardItem>

    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <VCardText v-else>
      <div v-if="!alumno">
        <div class="text-center py-6 text-medium-emphasis">
          <VIcon icon="ri-information-line" size="48" class="mb-3" />
          <p class="text-body-2">Selecciona un alumno para ver su historial.</p>
        </div>
      </div>

      <VRow v-else>
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="h-100">
            <VCardItem>
              <VCardTitle class="d-flex align-center gap-2">
                <VIcon icon="ri-user-add-line" color="success" size="24" />
                Registro del alumno
              </VCardTitle>
            </VCardItem>
            <VCardText>
              <VList density="compact">
                <VListItem>
                  <VListItemTitle class="text-sm font-weight-medium">Fecha de registro</VListItemTitle>
                  <VListItemSubtitle class="text-body-2">
                    {{ formatearFechaHora(alumno.created_at) }}
                  </VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle class="text-sm font-weight-medium">Antigüedad en el sistema</VListItemTitle>
                  <VListItemSubtitle class="text-body-2">{{ antiguedadAlumno }}</VListItemSubtitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="6">
          <VCard variant="outlined" class="h-100">
            <VCardItem>
              <VCardTitle class="d-flex align-center gap-2">
                <VIcon icon="ri-edit-line" color="warning" size="24" />
                Última modificación
              </VCardTitle>
            </VCardItem>
            <VCardText>
              <VList density="compact">
                <VListItem>
                  <VListItemTitle class="text-sm font-weight-medium">Fecha de actualización</VListItemTitle>
                  <VListItemSubtitle class="text-body-2">
                    {{ formatearFechaHora(alumno.updated_at) }}
                  </VListItemSubtitle>
                </VListItem>
 
              </VList>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
