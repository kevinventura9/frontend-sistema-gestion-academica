<template>
  <VDialog
    v-model="dialog"
    max-width="450px"
    >
    <VCard class="text-center pa-4">

      <VBtn
        icon
        size="small"
        class="absolute-top-right"
        @click="cancelar"
        variant="text"
      >
        <VIcon size="24">ri-close-line</VIcon>
      </VBtn>

      <VCardText class="d-flex flex-column justify-center align-center pt-8 pb-4">
        <VAvatar
          :color="tipo.color"
          variant="tonal"
          size="64"
          class="mb-4"
        >
          <VIcon
            size="32"
            :icon="tipo.icon"
          />
        </VAvatar>

        <h5 class="text-h5 font-weight-bold">
          {{ titulo }}
        </h5>
      </VCardText>

      <VCardText class="text-medium-emphasis pb-6 pt-0">
        <p class="text-body-1">{{ mensaje }}</p>
      </VCardText>

      <VCardActions class="justify-center pt-0 pb-6 gap-4">
        <VBtn
          :color="tipo.color"
          @click="confirmar"
          size="large"
          variant="flat"
        >
          {{ textoBotonConfirmar }}
        </VBtn>
        <VBtn
          variant="outlined"
          @click="cancelar"
          size="large"
        >
          Cancelar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  titulo: {
    type: String,
    default: 'Confirmación',
  },
  mensaje: {
    type: String,
    required: true,
  },
  tipo: {
    type: Object,
    default: () => ({
      color: 'primary',
      icon: 'ri-question-line',
    }),
  },
  textoBotonConfirmar: {
    type: String,
    default: 'Aceptar',
  },
})

const emit = defineEmits(['update:modelValue', 'confirmar', 'cancelar'])

const dialog = ref(props.modelValue)

// 1. Sincroniza el estado interno con el prop modelValue (abrir)
watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue
})

// 2. ¡CORRECCIÓN! Sincroniza el prop modelValue con el estado interno (cerrar)
watch(dialog, (newValue) => {
  if (newValue === false) {
    emit('update:modelValue', false)
  }
})

const confirmar = () => {
  emit('confirmar')
  cerrarDialog()
}

const cancelar = () => {
  emit('cancelar')
  cerrarDialog()
}

const cerrarDialog = () => {
  // Vuetify/Vue se encargará de propagar el cierre vía el watch(dialog, ...)
  dialog.value = false
}
</script>

<style scoped>
/* Clase para posicionar el botón de cierre con margen adecuado */
.absolute-top-right {
  position: absolute;
  inset-block-start: 1rem;
  inset-inline-end: 1rem;
}

/* Clase para manejar la separación horizontal de los botones */
.gap-4 {
  gap: 1rem;
}
</style>
