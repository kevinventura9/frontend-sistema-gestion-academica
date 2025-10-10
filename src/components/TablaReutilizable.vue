<script setup>
const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  search: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showSelect: {
    type: Boolean,
    default: false,
  },
  itemValue: {
    type: String,
    default: 'id',
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:modelValue'])

// Función para manejar la actualización de la selección
const updateSelection = (value) => {
  emits('update:modelValue', value)
}
</script>

<template>
  <VDataTable
    :model-value="modelValue"
    :headers="headers"
    :items="items"
    :search="search"
    :loading="loading"
    :show-select="showSelect"
    :item-value="itemValue"
    class="text-no-wrap"
    no-data-text="No hay datos disponibles"
    loading-text="Cargando información..."
    items-per-page-text="Elementos por página:"
    page-text="{0}-{1} de {2}"
    :items-per-page-options="[
      { value: 10, title: '10' },
      { value: 25, title: '25' },
      { value: 50, title: '50' },
      { value: 100, title: '100' },
      { value: -1, title: 'Todos' }
    ]"
    @update:model-value="updateSelection"
    v-bind="$attrs"
  >
    <!-- Slot para personalizar columnas -->
    <template 
      v-for="(_, name) in $slots" 
      #[name]="slotData"
    >
      <slot 
        :name="name" 
        v-bind="slotData" 
      />
    </template>

    <!-- Mensaje personalizado cuando no hay resultados de búsqueda -->
    <template #no-data>
      <div class="text-center pa-4">
        <VIcon 
          icon="ri-search-line" 
          size="48" 
          class="text-disabled mb-2"
        />
        <p class="text-h6 text-disabled mb-1">
          {{ search ? 'No se encontraron resultados' : 'No hay datos disponibles' }}
        </p>
        <p class="text-sm text-medium-emphasis">
          {{ search 
            ? `No se encontraron elementos que coincidan con "${search}"` 
            : 'Aún no hay información para mostrar'
          }}
        </p>
      </div>
    </template>
  </VDataTable>
</template>
