<script setup>
import { eliminarAlumno, getAlumnos } from '@/api/alumnos'
import ConfirmacionDialog from '@/components/ConfirmacionDialog.vue'
import TablaReutilizable from '@/components/TablaReutilizable.vue'
import { useAlertStore } from '@/stores/alertas'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormRegistroAlumnoModal from './form-registro-alumno-modal.vue'

const router = useRouter()
const alertStore = useAlertStore()

const search = ref('')
const selectedStudents = ref([])
const alumnos = ref([])
const loading = ref(false)
const errorMessage = ref('')
const isCreateModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const alumnoToDelete = ref(null)

const headers = [
  { title: 'Alumno', key: 'nombreCompleto', sortable: true },
  { title: 'NIE', key: 'nie', sortable: true },
  { title: 'Sexo', key: 'sexo', sortable: true },
  { title: 'Responsable', key: 'responsable', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const alumnosDecorados = computed(() => {
  return alumnos.value.map(alumno => {
    const nombreCompleto = `${alumno.nombres ?? ''} ${alumno.apellidos ?? ''}`.trim()
    const iniciales = nombreCompleto
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return {
      ...alumno,
      nombreCompleto: nombreCompleto || 'Sin nombre registrado',
      iniciales: iniciales || 'AL',
      responsable: alumno.nombre_responsable || 'Sin responsable',
      telefono_responsable: alumno.telefono_responsable || '—',
      sexo: alumno.sexo || 'N/D',
    }
  })
})

const sexoColorMap = {
  masculino: 'primary',
  femenino: 'pink',
  otro: 'secondary',
}

const loadAlumnos = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await getAlumnos()
    alumnos.value = response?.data ?? []
  } catch (error) {
    errorMessage.value = error?.error || 'No pudimos cargar los alumnos. Intenta nuevamente.'
    alertStore.showAlert({
      type: 'error',
      message: errorMessage.value,
    })
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isCreateModalOpen.value = true
}

const handleAlumnoCreado = () => {
  isCreateModalOpen.value = false
  loadAlumnos()
}

const goToProfile = alumno => {
  router.push(`/alumnos/${alumno.id}`)
}

const requestDelete = alumno => {
  alumnoToDelete.value = alumno
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!alumnoToDelete.value) return

  try {
    loading.value = true
    const response = await eliminarAlumno(alumnoToDelete.value.id)
    alertStore.showAlert({
      type: 'success',
      message: response?.message || 'Alumno eliminado correctamente',
    })
    await loadAlumnos()
  } catch (error) {
    alertStore.showAlert({
      type: 'error',
      message: error?.error || 'No se pudo eliminar el alumno',
    })
  } finally {
    loading.value = false
    isDeleteModalOpen.value = false
    alumnoToDelete.value = null
  }
}

onMounted(loadAlumnos)
</script>

<template>
  <VCard title="Lista de alumnos">
    <VCardText>
      <VRow class="mb-3">
        <VCol cols="12" sm="6" md="4">
          <VTextField
            v-model="search"
            label="Buscar alumnos..."
            variant="outlined"
            prepend-inner-icon="ri-search-line"
            clearable
            hide-details
          />
        </VCol>
        <VCol cols="12" sm="6" md="8" class="d-flex justify-end align-center">
          <VBtn color="primary" prepend-icon="ri-add-line" @click="openCreateModal">
            Agregar alumno
          </VBtn>
        </VCol>
      </VRow>

      <VAlert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-4"
        icon="ri-error-warning-line"
      >
        {{ errorMessage }}
      </VAlert>
    </VCardText>

    <ConfirmacionDialog
      v-model="isDeleteModalOpen"
      titulo="Eliminar alumno"
      :mensaje="alumnoToDelete ? `Eliminarás a ${alumnoToDelete.nombreCompleto}` : ''"
      :tipo="{ color: 'error', icon: 'ri-delete-bin-line' }"
      texto-boton-confirmar="Eliminar"
      @confirmar="confirmDelete"
    />

    <TablaReutilizable
      v-model="selectedStudents"
      :headers="headers"
      :items="alumnosDecorados"
      :search="search"
      :loading="loading"
      item-value="id"
      show-select
    >
      <template #item.nombreCompleto="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VAvatar size="36" color="primary" variant="tonal">
            <span class="text-sm font-weight-medium">{{ item.iniciales }}</span>
          </VAvatar>
          <div>
            <p class="text-body-1 font-weight-medium mb-1">{{ item.nombreCompleto }}</p>
            <span class="text-body-2 text-medium-emphasis">{{ item.email }}</span>
          </div>
        </div>
      </template>

      <template #item.sexo="{ item }">
        <VChip :color="sexoColorMap[item.sexo] || 'secondary'" size="small" class="text-capitalize">
          {{ item.sexo }}
        </VChip>
      </template>

      <template #item.responsable="{ item }">
        <div class="d-flex flex-column">
          <span class="text-body-1 font-weight-medium">{{ item.responsable }}</span>
          <small class="text-medium-emphasis">Tel. {{ item.telefono_responsable }}</small>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex align-center gap-1">
          <VBtn icon size="small" variant="text" color="info" @click="goToProfile(item)">
            <VIcon icon="ri-eye-line" size="18" />
            <VTooltip activator="parent">Ver perfil</VTooltip>
          </VBtn>
          <VBtn icon size="small" variant="text" color="error" @click="requestDelete(item)">
            <VIcon icon="ri-delete-bin-line" size="18" />
            <VTooltip activator="parent">Eliminar</VTooltip>
          </VBtn>
        </div>
      </template>
    </TablaReutilizable>

    <VDivider />

    <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3">
      <p class="text-sm text-disabled mb-0">
        {{ selectedStudents.length }} de {{ alumnos.length }} alumnos seleccionados
      </p>
    </div>

    <FormRegistroAlumnoModal
      v-model:is-visible="isCreateModalOpen"
      @alumno-creado="handleAlumnoCreado"
    />
  </VCard>
</template>
