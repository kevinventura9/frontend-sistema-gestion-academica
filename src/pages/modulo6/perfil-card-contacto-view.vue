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
const contacto = ref(null)

const contactosMock = {
  101: {
    responsable: {
      nombre: 'Patricia López',
      parentesco: 'Madre',
      telefono: '78880000',
      email: 'patricia.lopez@example.com',
    },
    emergencia: {
      nombre: 'Jorge López',
      parentesco: 'Hermano',
      telefono: '70112233',
    },
  },
  102: {
    responsable: {
      nombre: 'Luis Soriano',
      parentesco: 'Padre',
      telefono: '74441234',
      email: 'luis.soriano@example.com',
    },
    emergencia: {
      nombre: 'Ana Morales',
      parentesco: 'Tía',
      telefono: '75553322',
    },
  },
}

const contactoPropio = {
  responsable: {
    nombre: 'Carlos Mendoza',
    parentesco: 'Padre',
    telefono: '78889999',
    email: 'carlos.mendoza@example.com',
  },
  emergencia: {
    nombre: 'Laura Jiménez',
    parentesco: 'Tía',
    telefono: '76667788',
  },
}

const fetchContacto = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    contacto.value = props.esMiPerfil
      ? contactoPropio
      : contactosMock[props.alumnoId] ?? contactoPropio
  } catch (error) {
    alertStore.showAlert({
      type: 'warning',
      message: error.message || 'No se pudo obtener la información de contacto',
    })
    contacto.value = null
  } finally {
    loading.value = false
  }
}

const copiarTelefono = numero => {
  navigator.clipboard?.writeText(numero)
  alertStore.showAlert({
    type: 'info',
    message: 'Teléfono copiado al portapapeles',
  })
}

watch(
  () => [props.alumnoId, props.esMiPerfil],
  () => {
    fetchContacto()
  },
  { immediate: true },
)
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Contacto y responsables</VCardTitle>
      <VCardSubtitle>Información para notificaciones y seguimientos</VCardSubtitle>
    </VCardItem>

    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <VCardText v-else>
      <VRow v-if="contacto">
        <VCol cols="12" md="6">
          <VSheet rounded="lg" class="pa-4" color="primary" variant="tonal">
            <div class="text-overline mb-2">Responsable principal</div>
            <div class="text-h6 mb-1">{{ contacto.responsable.nombre }}</div>
            <p class="text-caption mb-4">{{ contacto.responsable.parentesco }}</p>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex align-center gap-2">
                <VIcon icon="ri-phone-line" size="18" />
                <span>{{ contacto.responsable.telefono }}</span>
                <VBtn icon variant="text" size="x-small" @click="copiarTelefono(contacto.responsable.telefono)">
                  <VIcon icon="ri-file-copy-line" size="16" />
                </VBtn>
              </div>
              <div class="d-flex align-center gap-2">
                <VIcon icon="ri-mail-line" size="18" />
                <span>{{ contacto.responsable.email }}</span>
              </div>
            </div>
          </VSheet>
        </VCol>

        <VCol cols="12" md="6">
          <VSheet rounded="lg" class="pa-4" color="warning" variant="tonal">
            <div class="text-overline mb-2">Contacto de emergencia</div>
            <div class="text-h6 mb-1">{{ contacto.emergencia.nombre }}</div>
            <p class="text-caption mb-4">{{ contacto.emergencia.parentesco }}</p>
            <div class="d-flex align-center gap-2">
              <VIcon icon="ri-phone-line" size="18" />
              <span>{{ contacto.emergencia.telefono }}</span>
              <VBtn icon variant="text" size="x-small" @click="copiarTelefono(contacto.emergencia.telefono)">
                <VIcon icon="ri-file-copy-line" size="16" />
              </VBtn>
            </div>
          </VSheet>
        </VCol>
      </VRow>

      <div v-else class="text-center text-medium-emphasis py-6">
        No existe información de contacto asociada.
      </div>
    </VCardText>
  </VCard>
</template>
