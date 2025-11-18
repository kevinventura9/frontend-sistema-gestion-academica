<script setup>
import PerfilAlumnoContacto from '@/pages/modulo6/perfil-card-contacto-view.vue'
import PerfilAlumnoDatos from '@/pages/modulo6/perfil-card-datos-alumno-view.vue'
import PerfilAlumnoHistorial from '@/pages/modulo6/perfil-card-historial-academico-view.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const alumnoId = computed(() => authStore.getUser?.alumno_id ?? null)

const activeTab = ref('datos-personales')
const tabs = [
  { title: 'Datos personales', icon: 'ri-user-3-line', tab: 'datos-personales' },
  { title: 'Datos familiares', icon: 'ri-user-heart-line', tab: 'familia' },
  { title: 'Expediente académico', icon: 'ri-archive-line', tab: 'expediente' },
]
</script>

<template>
  <div>
    <VTabs v-model="activeTab" show-arrows class="v-tabs-pill">
      <VTab v-for="tab in tabs" :key="tab.tab" :value="tab.tab">
        <VIcon :icon="tab.icon" size="20" start />
        {{ tab.title }}
      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition" :touch="false">
      <VWindowItem value="datos-personales">
        <PerfilAlumnoDatos :alumno-id="alumnoId" es-mi-perfil />
      </VWindowItem>

      <VWindowItem value="familia">
        <PerfilAlumnoContacto :alumno-id="alumnoId" es-mi-perfil />
      </VWindowItem>

      <VWindowItem value="expediente">
        <PerfilAlumnoHistorial :alumno-id="alumnoId" es-mi-perfil />
        <VCard class="mt-4" variant="outlined">
          <VCardText>
            <div class="d-flex align-center gap-3">
              <VIcon icon="ri-information-line" size="24" color="primary" />
              <div>
                <p class="text-body-1 font-weight-medium mb-1">Expediente académico</p>
                <p class="text-body-2 mb-0 text-medium-emphasis">
                  Esta sección se encuentra en desarrollo. Pronto podrás consultar resoluciones, historial de matrículas y observaciones oficiales.
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VWindowItem>
    </VWindow>
  </div>
</template>
