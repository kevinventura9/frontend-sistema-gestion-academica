<template>
  <VDialog
    v-model="dialog"
    max-width="500px"
    persistent
  >
    <VCard class="text-center">
      <VCardText class="d-flex flex-column justify-center align-center">
        <VBtn
          icon
          class="absolute-top-right"
          @click="cancelar"
          variant="text"
        >
          <VIcon>ri-close-line</VIcon>
        </VBtn>
        <VAvatar
          :color="tipo.color"
          variant="outlined"
          size="50"
          class="mb-4"
        >
          <VIcon
            size="2rem"
            :icon="tipo.icon"
          />
        </VAvatar>
        <h6 class="text-h6">
          {{ titulo }}
        </h6>
      </VCardText>

      <VCardText>
        <p>{{ mensaje }}</p>
      </VCardText>

      <VCardText class="d-flex justify-center gap-4">
        <VBtn
          :color="tipo.color"
          @click="confirmar"
        >
          {{ textoBotonConfirmar }}
        </VBtn>
        <VBtn
          variant="outlined"
          @click="cancelar"
        >
          Cancelar
        </VBtn>
      </VCardText>
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

watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue
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
  dialog.value = false
  emit('update:modelValue', false)
}
</script>

<style scoped>
.absolute-top-right {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-end: 0.5rem;
}
</style>
