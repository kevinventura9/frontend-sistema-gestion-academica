<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
</script>

<template>
  <!-- 👉 Inicio -->
  <VerticalNavLink
    :item="{
      title: 'Inicio',
      icon: 'ri-home-4-line',
      to: '/',
    }"
  />

  <!-- 👉 Seguridad -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Seguridad',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Usuarios y roles',
      icon: 'ri-group-line',
      to: '/usuarios',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Mi perfil',
      icon: 'ri-user-settings-line',
      to: '/perfil',
    }"
  />
    <!-- 👉 Matriculas -->
    <VerticalNavSectionTitle
      :item="{
        heading: 'Matriculas',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Alumnos',
        icon: 'ri-graduation-cap-line',
        to: '/alumnos',
      }"
    />
    <VerticalNavLink
    :item="{
      title: 'Matrículas',
      icon: 'ri-user-add-line',
      to: '/modulo5/matriculas',
    }"
  />
  <!-- Secciones -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Secciones',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Gestión de Secciones',
      icon: 'ri-list-check',
      to: '/modulo2/secciones-pages',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Consulta de Secciones',
      icon: 'ri-search-eye-line',
      to: '/modulo2/consulta-secciones',
    }"
  />
  <!-- Secciones -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Calificaciones',
    }"
  />
    <VerticalNavLink
      :item="{
        title: 'Configurar Porcentajes',
        to: '/calificaciones/configuracion',
        icon: 'ri-settings-3-line',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Gestionar Actividades',
        to: '/calificaciones/actividades',
        icon: 'ri-file-list-3-line',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Calificar Actividades',
        to: '/calificaciones/calificar',
        icon: 'ri-edit-2-line',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Notas Finales',
        to: '/calificaciones/notas-finales',
        icon: 'ri-bar-chart-line',
      }"
    />
  
</template>
