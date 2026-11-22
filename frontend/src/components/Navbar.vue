<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { cerrarSesion, usuario } from '../services/sesion'

const router = useRouter()

function salir() {
  cerrarSesion()
  router.push('/login')
}
</script>

<template>
  <header class="navbar">
    <h2>GameHub IPVG</h2>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/torneos">Torneos</RouterLink>
      <RouterLink to="/equipos">Equipos</RouterLink>
      <RouterLink to="/partidos">Partidos</RouterLink>
      <RouterLink to="/ranking">Ranking</RouterLink>
      <template v-if="usuario">
        <RouterLink to="/perfil">{{ usuario.alias }}</RouterLink>
        <button class="secundario" @click="salir">Cerrar sesión</button>
      </template>
      <template v-else>
        <RouterLink to="/login">Iniciar sesión</RouterLink>
        <RouterLink to="/registro">Registrarse</RouterLink>
      </template>
    </nav>
  </header>
</template>