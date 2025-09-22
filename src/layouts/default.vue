<script setup>
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue';
</script>

<template>
  <DefaultLayoutWithVerticalNav>
    <RouterView v-slot="{ Component }">
      <Transition
        name="page"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";

// Transition styles
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
