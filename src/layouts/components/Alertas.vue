<template>
  <v-snackbar
    v-model="utils.alert.show"
    :color="utils.alert.color"
    elevation="24"
    location="top right"
    :timeout="utils.alert.timeout"
  >
    <v-row>
      <v-col class="d-flex" cols="12">
        <div class="align-self-center justify-center">
          <v-icon v-if="utils.alert.type == 'error'" class="mr-5" size="large">
            ri-close-circle-line
          </v-icon>
          <v-icon v-if="utils.alert.type == 'info'" class="mr-5" size="large">
            ri-information-line
          </v-icon>
          <v-icon v-if="utils.alert.type == 'warning'" class="mr-5" size="large">
            ri-alert-line
          </v-icon>
          <v-icon v-if="utils.alert.type == 'success'" class="mr-5" size="large">
            ri-checkbox-circle-line
          </v-icon>
        </div>
        <div class="ml-0">{{ utils.alert.message }}</div>
      </v-col>
    </v-row>

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="utils.alert.show = false">
        <v-icon size="large">ri-close-line</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup>
  import { useAlertStore } from '@/stores/alertas';

  const utils = useAlertStore()
</script>
