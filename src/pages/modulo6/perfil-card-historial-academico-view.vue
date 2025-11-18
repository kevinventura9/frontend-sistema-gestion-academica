<script setup>
import { useAlertStore } from '@/stores/alertas'
import { ref, watch } from 'vue'

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
const indicadores = ref({ avance: 0, promedio: 0, ranking: '—' })
const eventos = ref([])

const historialMock = {
  101: {
    indicadores: { avance: 65, promedio: 8.6, ranking: 'Top 10%' },
    eventos: [
      { fecha: '2025-01-15', titulo: 'Inicio ciclo 01-2025', descripcion: 'Inscripción completada', tipo: 'info' },
      { fecha: '2024-11-30', titulo: 'Reconocimiento académico', descripcion: 'Mejor promedio del ciclo', tipo: 'success' },
      { fecha: '2024-06-12', titulo: 'Alerta de asistencia', descripcion: 'Asistencia menor al 80% en INF-205', tipo: 'warning' },
    ],
  },
  102: {
    indicadores: { avance: 48, promedio: 7.4, ranking: 'Top 35%' },
    eventos: [
      { fecha: '2024-10-10', titulo: 'Suspensión temporal', descripcion: 'Solicitud presentada por coordinación', tipo: 'error' },
    ],
  },
}

const propioMock = {
  indicadores: { avance: 32, promedio: 8.2, ranking: 'Top 15%' },
  eventos: [
    { fecha: '2025-01-10', titulo: 'Inicio ciclo', descripcion: 'Carga académica validada', tipo: 'info' },
  ],
}

const tipoColor = tipo => {
  const map = { success: 'success', info: 'info', warning: 'warning', error: 'error' }
  return map[tipo] || 'primary'
}

const fetchHistorial = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 250))
    const data = props.esMiPerfil ? propioMock : historialMock[props.alumnoId] ?? Object.values(historialMock)[0]
    if (!data) throw new Error('Historial no disponible')
    indicadores.value = data.indicadores
    eventos.value = data.eventos
  } catch (error) {
    alertStore.showAlert({
      type: 'warning',
      message: error.message || 'Sin eventos académicos que mostrar',
    })
    indicadores.value = { avance: 0, promedio: 0, ranking: '—' }
    eventos.value = []
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.alumnoId, props.esMiPerfil],
  () => {
    fetchHistorial()
  },
  { immediate: true },
)
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Seguimiento académico</VCardTitle>
    </VCardItem>

    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <template v-else>
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VSheet class="pa-4" rounded="lg" elevation="1">
              <div class="text-caption text-medium-emphasis">Avance del plan</div>
              <div class="text-h4">{{ indicadores.avance }}%</div>
              <VProgressLinear :model-value="indicadores.avance" color="primary" rounded height="6" class="mt-2" />
            </VSheet>
          </VCol>
          <VCol cols="12" md="4">
            <VSheet class="pa-4" rounded="lg" elevation="1">
              <div class="text-caption text-medium-emphasis">Promedio acumulado</div>
              <div class="text-h4">{{ indicadores.promedio }}</div>
            </VSheet>
          </VCol>
          <VCol cols="12" md="4">
            <VSheet class="pa-4" rounded="lg" elevation="1">
              <div class="text-caption text-medium-emphasis">Ranking</div>
              <div class="text-h5">{{ indicadores.ranking }}</div>
            </VSheet>
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText>
        <div class="text-subtitle-1 font-weight-medium mb-4">Eventos recientes</div>
        <VTimeline density="compact" side="end">
          <VTimelineItem
            v-for="evento in eventos"
            :key="evento.fecha + evento.titulo"
            :dot-color="tipoColor(evento.tipo)"
            size="tiny"
          >
            <template #opposite>
              <div class="text-caption text-medium-emphasis">{{ new Date(evento.fecha).toLocaleDateString('es-SV') }}</div>
            </template>
            <VCard variant="outlined">
              <VCardItem>
                <VCardTitle class="text-subtitle-2">{{ evento.titulo }}</VCardTitle>
                <VCardSubtitle>{{ evento.descripcion }}</VCardSubtitle>
              </VCardItem>
            </VCard>
          </VTimelineItem>

          <VTimelineItem v-if="!eventos.length" dot-color="secondary">
            <VCard variant="text">
              <VCardText class="text-medium-emphasis">Aún no hay eventos registrados.</VCardText>
            </VCard>
          </VTimelineItem>
        </VTimeline>
      </VCardText>
    </template>
  </VCard>
</template>
