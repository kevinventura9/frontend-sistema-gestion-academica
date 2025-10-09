<script setup>
import { getUsuarios } from '@/api/usuarios.js'
import TablaReutilizable from '@/components/TablaReutilizable.vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormRegistoUsuarioModal from './form-registo-usuario-modal.vue'


// Reactive data
const search = ref('')
const selectedUsers = ref([])
const usuarios = ref([])
const loading = ref(false)
const error = ref(null)
const mostrarModalUsuario = ref(false)
const router = useRouter()

const headers = [
  {
    title: 'Usuario',
    key: 'nombre_completo',
    sortable: true,
  },
  {
    title: 'Rol',
    key: 'rol',
    sortable: true,
  },
  {
    title: 'Teléfono',
    key: 'telefono',
    sortable: true,
  },
  {
    title: 'Estado',
    key: 'estado',
    sortable: true,
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false,
  },
]

// Computed para procesar usuarios y agregar avatar por defecto
const usuariosConAvatar = computed(() => {
  return usuarios.value.map(usuario => ({
    ...usuario,
    // Generar iniciales para el avatar
    iniciales: usuario.nombre_completo.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }))
})

const resolveUserRoleVariant = role => {
  const roleLowerCase = role.toLowerCase()
  if (roleLowerCase === 'docente')
    return {
      color: 'info',
      icon: 'ri-user-line',
    }
  if (roleLowerCase === 'director')
    return {
      color: 'director-purple',
      icon: 'ri-user-star-line',
    }
  if (roleLowerCase === 'administrador_academico')
    return {
      color: 'warning',
      icon: 'ri-admin-line',
    }
  
  return {
    color: 'secondary',
    icon: 'ri-user-line',
  }
}

const resolveUserStatusVariant = estado => {
  const estadoLowerCase = estado.toLowerCase()
  return estadoLowerCase === 'activo' ? 'success' : 'secondary'
}

// Función para mostrar texto del estado
const getEstadoTexto = (estado) => {
  const estadoLowerCase = estado.toLowerCase()
  return estadoLowerCase === 'activo' ? 'Activo' : 'Inactivo'
}

// Methods
const loadUsuarios = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await getUsuarios()
    usuarios.value = response.usuarios || []
  } catch (err) {
    error.value = 'Error al cargar los usuarios'
    // El error ya se imprime en la API, no necesitamos duplicarlo aquí
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  console.log('Redirigiendo a editar usuario:', user)
  // Redirigir a la ruta del perfil del usuario específico
  router.push(`/usuarios/${user.id}`)
}

const deleteUser = (user) => {
  console.log('Eliminar usuario:', user)
  // Aquí iría la lógica para eliminar usuario
}

// Función para abrir el modal de agregar usuario
const abrirModalUsuario = () => {
  mostrarModalUsuario.value = true
}

// Función para manejar cuando se crea un usuario
const manejarUsuarioCreado = (nuevoUsuario) => {
  console.log('Nuevo usuario creado:', nuevoUsuario)
  // Aquí puedes agregar la lógica para enviar al backend
  // Por ejemplo: await crearUsuario(nuevoUsuario)
  // Luego recargar la lista
  loadUsuarios()
}

// Lifecycle
onMounted(() => {
  loadUsuarios()
})
</script>

<template>
  <VCard title="Lista de Usuarios">
    <!-- Toolbar con búsqueda y botón agregar -->
    <VCardText>
      <VRow class="mb-3">
        <VCol
          cols="12"
          sm="6"
          md="4"
        >
          <VTextField
            v-model="search"
            prepend-inner-icon="ri-search-line"
            label="Buscar usuarios..."
            variant="outlined"
            clearable
            hide-details
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
          md="8"
          class="d-flex justify-end align-center"
        >
          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="abrirModalUsuario"
          >
            Agregar usuario
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>

    <!-- Tabla de datos -->
    <TablaReutilizable
      v-model="selectedUsers"
      :headers="headers"
      :items="usuariosConAvatar"
      :search="search"
      :loading="loading"
      item-value="id"
      show-select
    >
      <!-- Usuario -->
      <template #item.nombre_completo="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VAvatar
            size="34"
            variant="tonal"
            :color="resolveUserRoleVariant(item.rol).color"
          >
            <span class="text-sm font-weight-medium">
              {{ item.iniciales }}
            </span>
          </VAvatar>

          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.nombre_completo }}
            </h6>
            <span class="text-sm text-medium-emphasis">DUI: {{ item.dui }}</span>
          </div>
        </div>
      </template>

      <!-- Rol -->
      <template #item.rol="{ item }">
        <div class="d-flex align-center gap-2">
          <VIcon
            :icon="resolveUserRoleVariant(item.rol).icon"
            :color="resolveUserRoleVariant(item.rol).color"
            size="22"
          />
          <span class="text-capitalize text-high-emphasis">
            {{ item.rol === 'administrador_academico' ? 'Administrador' : item.rol }}
          </span>
        </div>
      </template>

      <!-- Estado -->
      <template #item.estado="{ item }">
        <VChip
          :color="resolveUserStatusVariant(item.estado)"
          size="small"
          class="text-capitalize"
        >
          {{ getEstadoTexto(item.estado) }}
        </VChip>
      </template>

      <!-- Acciones -->
      <template #item.actions="{ item }">
        <div class="d-flex align-center gap-2">
          <VBtn
            icon
            size="small"
            color="info"
            variant="text"
            @click="editUser(item)"
          >
            <VIcon
              size="20"
              icon="ri-edit-line"
            />
            <VTooltip
              activator="parent"
              location="top"
            >
              Editar
            </VTooltip>
          </VBtn>

          <VBtn
            icon
            size="small"
            color="error"
            variant="text"
            @click="deleteUser(item)"
          >
            <VIcon
              size="20"
              icon="ri-delete-bin-line"
            />
            <VTooltip
              activator="parent"
              location="top"
            >
              Eliminar
            </VTooltip>
          </VBtn>
        </div>
      </template>

      <!-- Pie de página personalizado -->
      <template #bottom>
        <VDivider />
        <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3">
          <p class="text-sm text-disabled mb-0">
            {{ selectedUsers.length }} de {{ usuarios.length }} usuarios seleccionados
          </p>
        </div>
      </template>
    </TablaReutilizable>

    <!-- Modal de agregar usuario -->
    <FormRegistoUsuarioModal
      v-model:is-visible="mostrarModalUsuario"
      @usuario-creado="manejarUsuarioCreado"
    />
  </VCard>
</template>
