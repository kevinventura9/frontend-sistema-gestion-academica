<script setup>
import PerfilUsuarioHistorial from '@/pages/modulo1/perfil-card-auditoria-view.vue'
import PerfilUsuarioCuenta from '@/pages/modulo1/perfil-card-datos-view.vue'
import PerfilUsuarioPermisos from '@/pages/modulo1/perfil-card-permisos-view.vue'
import PerfilUsuarioSeguridad from '@/pages/modulo1/perfil-card-seguridad-view.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(route.params.tab || 'cuenta')
const isUsuarioCargado = ref(true) // Para mi perfil, siempre estará cargado

// Función para manejar el evento del componente hijo
const handleUsuarioCargado = (status) => {
  isUsuarioCargado.value = status
}

// tabs - mismo orden que edición de usuarios
const tabs = [
  {
    title: 'Cuenta',
    icon: 'ri-group-line',
    tab: 'cuenta',
  },
  {
    title: 'Seguridad',
    icon: 'ri-lock-line',
    tab: 'seguridad',
  },
  {
    title: 'Permisos',
    icon: 'ri-shield-user-line',
    tab: 'permisos',
  },
  {
    title: 'Historial',
    icon: 'ri-time-line',
    tab: 'historial',
  },
]
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      show-arrows
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        :disabled="item.tab !== 'cuenta' && !isUsuarioCargado"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- Cuenta (Mi Perfil) -->
      <VWindowItem value="cuenta">
        <PerfilUsuarioCuenta 
          :es-mi-perfil="true" 
          @usuario-cargado="handleUsuarioCargado" 
        />
      </VWindowItem>

      <template v-if="isUsuarioCargado">
        <!-- Seguridad -->
        <VWindowItem value="seguridad">
          <PerfilUsuarioSeguridad :es-mi-perfil="true" />
        </VWindowItem>

        <!-- Historial -->
        <VWindowItem value="historial">
          <PerfilUsuarioHistorial :es-mi-perfil="true" />
        </VWindowItem>
        
        <!-- Permisos -->
        <VWindowItem value="permisos">
          <PerfilUsuarioPermisos :es-mi-perfil="true" />
        </VWindowItem> 
      </template>
    </VWindow> 
  </div>
</template>
