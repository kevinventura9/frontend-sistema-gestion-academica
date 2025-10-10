<script setup>
import { useTheme } from 'vuetify'

const props = defineProps({
  themes: {
    type: Array,
    required: true,
  },
})

const {
  name: themeName,
  global: globalTheme,
} = useTheme()

// Persisitir el tema en localStorage
const savedTheme = useLocalStorage('materio-theme', 'light')

// Restaurar el tema guardado al cargar
onMounted(() => {
  if (savedTheme.value && props.themes.some(t => t.name === savedTheme.value)) {
    globalTheme.name.value = savedTheme.value
  }
})

const {
  state: currentThemeName,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(props.themes.map(t => t.name), { initialValue: globalTheme.name.value })

const changeTheme = () => {
  const nextTheme = getNextThemeName()
  globalTheme.name.value = nextTheme
  savedTheme.value = nextTheme
  
  // Actualizar el color de fondo del loader según el tema
  const loaderBg = nextTheme === 'dark' ? '#1E1E1E' : '#FFFFFF'
  localStorage.setItem('materio-initial-loader-bg', loaderBg)
}

// Función para traducir nombres de temas a español
const getThemeDisplayName = (themeName) => {
  const themeNames = {
    light: 'Claro',
    dark: 'Oscuro'
  }
  return themeNames[themeName] || themeName
}

// Update icon if theme is changed from other sources
watch(() => globalTheme.name.value, val => {
  currentThemeName.value = val
  savedTheme.value = val
  
  // Actualizar el color de fondo del loader según el tema
  const loaderBg = val === 'dark' ? '#1E1E1E' : '#FFFFFF'
  localStorage.setItem('materio-initial-loader-bg', loaderBg)
})
</script>

<template>
  <IconBtn @click="changeTheme">
    <VIcon :icon="props.themes[currentThemeIndex].icon" />
    <VTooltip
      activator="parent"
      open-delay="1000"
      scroll-strategy="close"
    >
      <span class="text-capitalize">{{ getThemeDisplayName(currentThemeName) }}</span>
    </VTooltip>
  </IconBtn>
</template>
