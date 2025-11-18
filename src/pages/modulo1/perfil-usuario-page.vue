<script setup>
import PerfilUsuarioCuenta from '@/pages/modulo1/perfil-card-datos-view.vue'
import PerfilUsuarioAuditoria from '@/pages/modulo1/perfil-card-auditoria-view.vue'
import PerfilUsuarioPermisos from '@/pages/modulo1/perfil-card-permisos-view.vue'
import PerfilUsuarioSeguridad from '@/pages/modulo1/perfil-card-seguridad-view.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(route.params.tab || 'cuenta')
const isUsuarioCargado = ref(true) // Nuevo estado

// Función para manejar el evento del componente hijo
const handleUsuarioCargado = (status) => {
  isUsuarioCargado.value = status
}
// Obtener el ID del usuario desde la ruta
const userId = route.params.id

// tabs
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
    title: 'Auditoría',
    icon: 'ri-time-line',
    tab: 'auditoria',
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
      <!-- Cuenta -->
      <VWindowItem value="cuenta">
        <PerfilUsuarioCuenta :user-id="userId" @usuario-cargado="handleUsuarioCargado" />
      </VWindowItem>

      <template v-if="isUsuarioCargado">
        <!-- Seguridad -->
        <VWindowItem value="seguridad">
          <PerfilUsuarioSeguridad :user-id="userId" />
        </VWindowItem>

        <!-- Auditoría -->
        <VWindowItem value="auditoria">
          <PerfilUsuarioAuditoria :user-id="userId" />
        </VWindowItem>
        
        <!-- Permisos -->
        <VWindowItem value="permisos">
          <PerfilUsuarioPermisos :user-id="userId" />
        </VWindowItem> 
      </template>
    </VWindow> 
  </div>
</template>
