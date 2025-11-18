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
const resumen = ref({
  creditos: 0,
  materiasAprobadas: 0,
  promedio: 0,
})
const ciclos = ref([])

const dataMock = {
  101: {
    resumen: { creditos: 84, materiasAprobadas: 28, promedio: 8.6 },
    ciclos: [
      {
        ciclo: '01-2025',
        estado: 'En curso',
        materias: [
          { codigo: 'INF-301', nombre: 'Arquitectura de Software', uv: 4, estado: 'Cursando' },
          { codigo: 'MAT-205', nombre: 'Estadística II', uv: 4, estado: 'Cursando' },
        ],
      },
      {
        ciclo: '02-2024',
        estado: 'Aprobado',
        materias: [
          { codigo: 'INF-205', nombre: 'Estructuras de Datos', uv: 4, estado: 'Aprobada' },
          { codigo: 'INF-210', nombre: 'Programación Web', uv: 4, estado: 'Aprobada' },
        ],
      },
    ],
  },
  102: {
    resumen: { creditos: 60, materiasAprobadas: 20, promedio: 7.4 },
    ciclos: [
      {
        ciclo: '01-2024',
        estado: 'Suspendido',
        materias: [
          { codigo: 'ADM-201', nombre: 'Gestión Financiera', uv: 4, estado: 'Reprobada' },
          { codigo: 'ADM-210', nombre: 'Comportamiento Organizacional', uv: 3, estado: 'Aprobada' },
        ],
      },
    ],
  },
}

const perfilPropio = {
  resumen: { creditos: 30, materiasAprobadas: 10, promedio: 8.1 },
  ciclos: [
    {
      ciclo: '01-2025',
      estado: 'En curso',
      materias: [
        { codigo: 'INF-150', nombre: 'Algoritmos', uv: 4, estado: 'Cursando' },
      ],
    },
  ],
}

const estadoCicloColor = estado => {
  const map = {
    'En curso': 'info',
    Aprobado: 'success',
    Suspendido: 'warning',
  }
  return map[estado] || 'secondary'
}

const fetchMatriculas = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    const base = props.esMiPerfil ? perfilPropio : dataMock[props.alumnoId] ?? Object.values(dataMock)[0]
    if (!base) throw new Error('Sin registros de matrícula')
    resumen.value = base.resumen
    ciclos.value = base.ciclos
  } catch (error) {
    alertStore.showAlert({
      type: 'warning',
      message: error.message || 'No hay datos de matrícula disponibles',
    })
    resumen.value = { creditos: 0, materiasAprobadas: 0, promedio: 0 }
    ciclos.value = []
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.alumnoId, props.esMiPerfil],
  () => {
    fetchMatriculas()
  },
  { immediate: true },
)
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Matrículas por ciclo</VCardTitle>
    </VCardItem>

    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <template v-else>
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VSheet class="pa-4" rounded="lg" color="primary" variant="tonal">
              <div class="text-caption text-medium-emphasis">Créditos acumulados</div>
              <div class="text-h5">{{ resumen.creditos }}</div>
            </VSheet>
          </VCol>
          <VCol cols="12" md="4">
            <VSheet class="pa-4" rounded="lg" color="success" variant="tonal">
              <div class="text-caption text-medium-emphasis">Materias aprobadas</div>
              <div class="text-h5">{{ resumen.materiasAprobadas }}</div>
            </VSheet>
          </VCol>
          <VCol cols="12" md="4">
            <VSheet class="pa-4" rounded="lg" color="warning" variant="tonal">
              <div class="text-caption text-medium-emphasis">Promedio general</div>
              <div class="text-h5">{{ resumen.promedio }}</div>
            </VSheet>
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText>
        <VExpansionPanels variant="accordion">
          <VExpansionPanel v-for="ciclo in ciclos" :key="ciclo.ciclo">
            <VExpansionPanelTitle>
              <div class="d-flex justify-space-between w-100 align-center">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Ciclo {{ ciclo.ciclo }}</div>
                  <div class="text-caption text-medium-emphasis">{{ ciclo.materias.length }} materias</div>
                </div>
                <VChip :color="estadoCicloColor(ciclo.estado)" size="small">{{ ciclo.estado }}</VChip>
              </div>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VTable density="comfortable">
                <thead>
                  <tr>
                    <th class="text-left">Código</th>
                    <th class="text-left">Materia</th>
                    <th class="text-left">UV</th>
                    <th class="text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="materia in ciclo.materias" :key="materia.codigo">
                    <td>{{ materia.codigo }}</td>
                    <td>{{ materia.nombre }}</td>
                    <td>{{ materia.uv }}</td>
                    <td>
                      <VChip
                        size="x-small"
                        :color="materia.estado === 'Aprobada' ? 'success' : materia.estado === 'Reprobada' ? 'error' : 'info'"
                      >
                        {{ materia.estado }}
                      </VChip>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>
    </template>
  </VCard>
</template>
