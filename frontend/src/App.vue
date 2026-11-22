<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />
  <main>
    <RouterView />
  </main>
  <footer>
    <p>GameHub IPVG · Lenguaje de Programación Web II · 2026</p>
  </footer>
</template>