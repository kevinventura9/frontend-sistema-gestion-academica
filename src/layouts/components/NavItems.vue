<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
</script>

<template>
  <VerticalNavLink
    :item="{
      title: 'Inicio',
      icon: 'ri-home-4-line',
      to: '/dashboard',
    }"
  />

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
</template>
