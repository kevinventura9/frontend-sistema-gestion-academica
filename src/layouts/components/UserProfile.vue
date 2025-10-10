<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

// Computed para obtener las iniciales del usuario
const userInitials = computed(() => {
  if (!authStore.user?.nombre_completo) return 'NN'
  return authStore.user.nombre_completo
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Computed para formatear el rol
const userRole = computed(() => {
  if (!authStore.user?.rol) return 'Usuario'
  const rol = authStore.user.rol
  return rol === 'administrador_academico' ? 'Administrador' : 
         rol.charAt(0).toUpperCase() + rol.slice(1)
})

// Computed para obtener el color del rol
const userRoleColor = computed(() => {
  if (!authStore.user?.rol) return 'primary'
  const roleLowerCase = authStore.user.rol.toLowerCase()
  
  if (roleLowerCase === 'docente')
    return 'info'
  if (roleLowerCase === 'director')
    return 'director-purple'
  if (roleLowerCase === 'administrador_academico')
    return 'warning'
  
  return 'secondary'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const goToProfile = () => {
  // Redirigir al perfil del usuario
  router.push('/account-settings')
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar
      class="cursor-pointer"
      :color="userRoleColor"
      variant="tonal"
    >
      <span class="text-sm font-weight-medium">
        {{ userInitials }}
      </span>

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    :color="userRoleColor"
                    variant="tonal"
                  >
                    <span class="text-sm font-weight-medium">
                      {{ userInitials }}
                    </span>
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ authStore.user?.nombre_completo || 'Usuario' }}
            </VListItemTitle>
            <VListItemSubtitle>{{ userRole }}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem 
            link
            @click="goToProfile"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="ri-user-settings-line"
                size="22"
              />
            </template>

            <VListItemTitle>Perfil</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="ri-logout-box-r-line"
                size="22"
              />
            </template>

            <VListItemTitle>Cerrar sesión</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
