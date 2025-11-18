<script setup>
import PerfilAlumnoContacto from '@/pages/modulo6/perfil-card-contacto-view.vue'
import PerfilAlumnoDatos from '@/pages/modulo6/perfil-card-datos-alumno-view.vue'
import PerfilAlumnoHistorial from '@/pages/modulo6/perfil-card-historial-academico-view.vue'
import PerfilAlumnoAuditoria from '@/pages/modulo6/perfil-card-auditoria-view.vue'
import PerfilAlumnoMatriculas from '@/pages/modulo6/perfil-card-matriculas-view.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(route.params.tab || 'datos')
const alumnoId = computed(() => route.params.id)
const puedeMostrarDetalle = ref(false)

const tabs = [
  { title: 'Datos', icon: 'ri-user-3-line', tab: 'datos' },
  { title: 'Académico', icon: 'ri-graduation-cap-line', tab: 'academico' },
  { title: 'Matrículas', icon: 'ri-booklet-line', tab: 'matriculas' },
  { title: 'Auditoría', icon: 'ri-time-line', tab: 'auditoria' },
  { title: 'Responsable', icon: 'ri-user-heart-line', tab: 'contacto' },
]

const handleAlumnoCargado = estado => {
  puedeMostrarDetalle.value = estado
}

watch(
  () => route.params.tab,
  newTab => {
    if (newTab) {
      activeTab.value = newTab
    }
  },
)
</script>

<template>
  <div>
    <VTabs v-model="activeTab" show-arrows class="v-tabs-pill">
      <VTab
        v-for="tab in tabs"
        :key="tab.tab"
        :value="tab.tab"
        :disabled="tab.tab !== 'datos' && !puedeMostrarDetalle"
      >
        <VIcon :icon="tab.icon" size="20" start />
        {{ tab.title }}
      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition" :touch="false">
      <VWindowItem value="datos">
        <PerfilAlumnoDatos :alumno-id="alumnoId" @alumno-cargado="handleAlumnoCargado" />
      </VWindowItem>

      <template v-if="puedeMostrarDetalle">
        <VWindowItem value="academico">
          <PerfilAlumnoHistorial :alumno-id="alumnoId" />
        </VWindowItem>

        <VWindowItem value="matriculas">
          <PerfilAlumnoMatriculas :alumno-id="alumnoId" />
        </VWindowItem>

        <VWindowItem value="auditoria">
          <PerfilAlumnoAuditoria :alumno-id="alumnoId" />
        </VWindowItem>

        <VWindowItem value="contacto">
          <PerfilAlumnoContacto :alumno-id="alumnoId" />
        </VWindowItem>
      </template>
    </VWindow>
  </div>
</template>
