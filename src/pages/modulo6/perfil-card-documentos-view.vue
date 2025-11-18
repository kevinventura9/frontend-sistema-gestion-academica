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
const documentos = ref([])

const documentosMock = {
  101: [
    { nombre: 'Partida de nacimiento', estado: 'Validado', updatedAt: '2024-05-12' },
    { nombre: 'Solvencia financiera', estado: 'Pendiente', updatedAt: '2025-01-05' },
  ],
  102: [
    { nombre: 'Constancia de notas', estado: 'Observado', updatedAt: '2024-09-01' },
  ],
}

const documentosPropios = [
  { nombre: 'Constancia médica', estado: 'Pendiente', updatedAt: '2025-01-03' },
]

const estadoColor = estado => {
  const map = {
    Validado: 'success',
    Pendiente: 'warning',
    Observado: 'error',
  }
  return map[estado] || 'secondary'
}

const fetchDocumentos = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    documentos.value = props.esMiPerfil
      ? documentosPropios
      : documentosMock[props.alumnoId] ?? documentosPropios
  } catch (error) {
    alertStore.showAlert({
      type: 'warning',
      message: error.message || 'No se pudieron cargar los documentos',
    })
    documentos.value = []
  } finally {
    loading.value = false
  }
}

const marcarComoSubido = documento => {
  if (documento.estado === 'Validado') return
  documento.estado = 'Validado'
  documento.updatedAt = new Date().toISOString().slice(0, 10)
  alertStore.showAlert({
    type: 'success',
    message: `${documento.nombre} marcado como completado`,
  })
}

watch(
  () => [props.alumnoId, props.esMiPerfil],
  () => {
    fetchDocumentos()
  },
  { immediate: true },
)
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Documentos requeridos</VCardTitle>
      <VCardSubtitle>Control de entregables para procesos de matrícula</VCardSubtitle>
    </VCardItem>

    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <VCardText v-else>
      <VTable density="comfortable">
        <thead>
          <tr>
            <th class="text-left">Documento</th>
            <th class="text-left">Estado</th>
            <th class="text-left">Actualizado</th>
            <th class="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documentos" :key="doc.nombre">
            <td>{{ doc.nombre }}</td>
            <td>
              <VChip size="small" :color="estadoColor(doc.estado)">{{ doc.estado }}</VChip>
            </td>
            <td>{{ new Date(doc.updatedAt).toLocaleDateString('es-SV') }}</td>
            <td>
              <VBtn
                size="small"
                variant="text"
                color="primary"
                :disabled="doc.estado === 'Validado'"
                @click="marcarComoSubido(doc)"
              >
                Marcar como entregado
              </VBtn>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="!documentos.length">
          <tr>
            <td colspan="4" class="text-center text-medium-emphasis py-6">
              No hay documentos configurados para este alumno.
            </td>
          </tr>
        </tfoot>
      </VTable>
    </VCardText>
  </VCard>
</template>
