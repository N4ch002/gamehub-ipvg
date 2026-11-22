<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eliminarEquipo, obtenerEquipo } from '../services/equiposService'
import { esAdmin, usuario } from '../services/sesion'

const route = useRoute()
const router = useRouter()
const equipo = ref(null)
const cargando = ref(true)
const error = ref('')

const puedeGestionar = computed(() =>
  equipo.value && (esAdmin.value || equipo.value.capitanId === usuario.value?.id)
)

async function cargar() {
  try {
    cargando.value = true
    equipo.value = await obtenerEquipo(route.params.id)
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function borrar() {
  if (!confirm(`¿Eliminar el equipo ${equipo.value.nombre}?`)) return
  try {
    await eliminarEquipo(equipo.value.id)
    router.push('/equipos')
  } catch (e) {
    error.value = e.message
  }
}

onMounted(cargar)
</script>

<template>
  <section class="pagina">
    <p v-if="cargando">Cargando equipo...</p>
    <div v-else-if="error">
      <h2>{{ error }}</h2>
      <RouterLink to="/equipos">Volver a equipos</RouterLink>
    </div>
    <div v-else class="panel">
      <span class="etiqueta">{{ equipo.estado }}</span>
      <h1>{{ equipo.nombre }}</h1>
      <p>Juego preferido: {{ equipo.juegoPreferido }}</p>
      <h3>Integrantes</h3>
      <ul>
        <li v-for="integrante in equipo.integrantes" :key="integrante.id">
          {{ integrante.nombre }} ({{ integrante.alias }})
          <strong v-if="integrante.id === equipo.capitanId"> · Capitán</strong>
        </li>
      </ul>
      <div class="acciones">
        <template v-if="puedeGestionar">
          <RouterLink :to="`/equipos/${equipo.id}/editar`">Editar</RouterLink>
          <button class="peligro" @click="borrar">Eliminar</button>
        </template>
        <RouterLink to="/equipos">← Volver</RouterLink>
      </div>
    </div>
  </section>
</template>