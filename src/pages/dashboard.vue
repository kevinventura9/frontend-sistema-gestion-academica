<script setup>
const resumenEstadisticas = [
  {
    titulo: 'Estudiantes inscritos',
    valor: '1,245',
    variacion: '+4,2% vs. 2024',
    color: 'primary',
    icono: 'ri-team-line',
  },
  {
    titulo: 'Secciones activas',
    valor: '86',
    variacion: '12 pendientes de cierre',
    color: 'success',
    icono: 'ri-book-3-line',
  },
  {
    titulo: 'Docentes',
    valor: '57',
    variacion: '+9 en el último trimestre',
    color: 'info',
    icono: 'ri-award-line',
  },
]

const indicadoresProgreso = [
  {
    titulo: 'Subida de asistencias',
    valor: 72,
    color: 'primary',
    descripcion: 'Docentes que ya subieron asistencias',
  },
  {
    titulo: 'Carga de calificaciones',
    valor: 54,
    color: 'success',
    descripcion: 'Docentes que ya registraron calificaciones',
  },
]

const ultimosAccesos = [
  {
    nombre: 'Laura García',
    rol: 'Docente',
    fecha: '11 OCT · 07:45',
  },
  {
    nombre: 'Carlos Méndez',
    rol: 'Administrador',
    fecha: '10 OCT · 19:28',
  },
  {
    nombre: 'María López',
    rol: 'Docente',
    fecha: '10 OCT · 18:54',
  },
  {
    nombre: 'Daniel Ruiz',
    rol: 'Docente',
    fecha: '10 OCT · 18:10',
  },
]

const avisosRapidos = [
  '3 docentes no han firmado las actas del módulo 1.',
  'Se detectaron 12 inscripciones duplicadas pendientes de depuración.',
  'El portal estudiantil tendrá mantenimiento programado el 14 OCT de 22:00 a 23:30.',
]
</script>

<template>
  <VRow class="match-height" align="stretch">
    <VCol cols="12">
      <VCard class="pa-4" elevation="1">
        <VCardTitle class="text-h5 font-weight-semibold">Panel de Gestión Académica</VCardTitle>
        <VCardSubtitle>Resumen del año escolar 2025</VCardSubtitle>
        <VCardText class="pt-4">
          <VRow>
            <VCol
              v-for="tarjeta in resumenEstadisticas"
              :key="tarjeta.titulo"
              cols="12"
              sm="6"
              md="3"
            >
              <VCard :color="`${tarjeta.color}-lighten-5`" variant="flat">
                <VCardItem>
                  <template #prepend>
                    <VAvatar :color="tarjeta.color" variant="tonal">
                      <VIcon :icon="tarjeta.icono" />
                    </VAvatar>
                  </template>

                  <VCardTitle class="text-subtitle-1">{{ tarjeta.titulo }}</VCardTitle>
                  <VCardSubtitle class="text-body-2">{{ tarjeta.variacion }}</VCardSubtitle>
                </VCardItem>
                <VCardText class="pt-0">
                  <span class="text-h4 font-weight-medium">{{ tarjeta.valor }}</span>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <VCard elevation="1">
        <VCardItem>
          <VCardTitle class="text-h6">Indicadores críticos</VCardTitle>
          <VCardSubtitle>Seguimiento semanal de cumplimiento</VCardSubtitle>
        </VCardItem>
        <VCardText>
          <VList lines="two">
            <VListItem
              v-for="indicador in indicadoresProgreso"
              :key="indicador.titulo"
            >
              <template #prepend>
                <VAvatar :color="indicador.color" size="40">
                  <span class="text-white font-weight-semibold">{{ indicador.valor }}%</span>
                </VAvatar>
              </template>

              <VListItemTitle class="font-weight-medium">{{ indicador.titulo }}</VListItemTitle>
              <VListItemSubtitle>{{ indicador.descripcion }}</VListItemSubtitle>

              <template #append>
                <VProgressCircular
                  :model-value="indicador.valor"
                  :color="indicador.color"
                  size="48"
                  width="6"
                />
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <VCard elevation="1">
        <VCardItem>
          <VCardTitle class="text-h6">Últimos accesos al sistema</VCardTitle>
          <VCardSubtitle>Monitoreo de actividad reciente</VCardSubtitle>
        </VCardItem>
        <VCardText>
          <VList lines="two">
            <VListItem
              v-for="acceso in ultimosAccesos"
              :key="`${acceso.nombre}-${acceso.fecha}`"
            >
              <template #prepend>
                <VAvatar color="info" variant="tonal">
                  <VIcon icon="ri-user-smile-line" />
                </VAvatar>
              </template>
              <VListItemTitle class="font-weight-medium">{{ acceso.nombre }}</VListItemTitle>
              <VListItemSubtitle>{{ acceso.rol }} · {{ acceso.fecha }}</VListItemSubtitle>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard elevation="1">
        <VCardItem>
          <VCardTitle class="text-h6">Avisos rápidos</VCardTitle>
          <VCardSubtitle>Acciones recomendadas para hoy</VCardSubtitle>
        </VCardItem>
        <VCardText>
          <VList>
            <VListItem
              v-for="(aviso, index) in avisosRapidos"
              :key="`aviso-${index}`"
            >
              <template #prepend>
                <VAvatar color="warning" variant="tonal">
                  <VIcon icon="ri-alert-line" />
                </VAvatar>
              </template>
              <VListItemTitle>{{ aviso }}</VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
