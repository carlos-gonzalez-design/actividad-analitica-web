<script setup>
import AppHeader from './components/AppHeader.vue'
import CookieConsent from './components/CookieConsent.vue'
</script>

<template>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <AppHeader />
  <RouterView />
  <CookieConsent />
</template>
