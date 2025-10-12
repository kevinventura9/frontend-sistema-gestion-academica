<script setup>
import { useAuthStore } from '@/stores/auth'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import logoLargo from '/logo_largo.png'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const isPasswordVisible = ref(false)
const isLoading = ref(false)
const errors = ref({
  email: '',
  password: '',
  general: ''
})

// Validación de campos vacíos (frontend)
const validateForm = () => {
  const newErrors = { email: '', password: '', general: '' }
  let isValid = true

  if (!form.value.email.trim()) {
    newErrors.email = 'El correo electrónico es obligatorio'
    isValid = false
  }

  if (!form.value.password.trim()) {
    newErrors.password = 'La contraseña es obligatoria'
    isValid = false
  }

  errors.value = newErrors
  return isValid
}

// Limpiar errores cuando el usuario empiece a escribir
const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = ''
  }
}

const handleLogin = async () => {
  // Validación frontend primero
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  errors.value = { email: '', password: '', general: '' }

  try {
    await authStore.login(form.value.email, form.value.password)
    router.push('/dashboard')
  } catch (error) {
    if (error.type === 'validation' && error.errors) {
      // Mapear errores específicos de Laravel a los campos
      if (error.errors.email && error.errors.email[0]) {
        errors.value.email = error.errors.email[0]
      }
      if (error.errors.password && error.errors.password[0]) {
        errors.value.password = error.errors.password[0]
      }
      // Si hay otros errores no mapeados, mostrar como error general
      if (!errors.value.email && !errors.value.password && error.message) {
        errors.value.general = error.message
      }
    } else {
      // Error general (red, servidor, etc.)
      errors.value.general = error.message || 'Error al iniciar sesión'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center" >
        <img
            :src="logoLargo"
            alt="Colegio Bautista Misión de Fe"
            height="100rem"
          />
      </VCardItem>

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">
          ¡Bienvenido al Sistema de Gestión Académica!
        </h4>
        <p class="mb-0">
          Por favor, inicia sesión para acceder al sistema.
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="handleLogin">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                id="campo-email"
                v-model="form.email"
                label="Correo electrónico"
                type="email"
                :disabled="isLoading"
                :error="!!errors.email"
                :error-messages="errors.email"
                @input="clearError('email')"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                id="campo-password"
                v-model="form.password"
                label="Contraseña"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :disabled="isLoading"
                :error="!!errors.password"
                :error-messages="errors.password"
                @input="clearError('password')"
              />

                <!-- Olvidaste tu contraseña link -->
                <div class="d-flex align-end justify-end flex-wrap my-6">
                  <a
                  class="text-primary"
                  href="javascript:void(0)"
                  >
                  ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <!-- Error general -->
                <div v-if="errors.general" class="mb-4">
                  <VAlert type="error" dismissible>
                    {{ errors.general }}
                  </VAlert>
                </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
                class="mt-6"
                :loading="isLoading"
                :disabled="isLoading"
              >
                Iniciar sesión
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>

