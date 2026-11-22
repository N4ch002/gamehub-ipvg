<script setup>
import { computed, onMounted, ref } from 'vue'
import EquipoCard from '../components/EquipoCard.vue'
import { eliminarEquipo, obtenerEquipos } from '../services/equiposService'
import { esAdmin, usuario } from '../services/sesion'

const equipos = ref([])
const cargando = ref(true)
const error = ref('')
const mensaje = ref('')
const busqueda = ref('')
const juego = ref('Todos')

const juegos = computed(() => ['Todos', ...new Set(equipos.value.map(e => e.juegoPreferido))])

const equiposFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return equipos.value.filter(e =>
    e.nombre.toLowerCase().includes(texto) &&
    (juego.value === 'Todos' || e.juegoPreferido === juego.value)
  )
})

function puedeGestionar(equipo) {
  return esAdmin.value || equipo.capitanId === usuario.value?.id
}

async function cargar() {
  try {
    cargando.value = true
    error.value = ''
    equipos.value = await obtenerEquipos()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function borrar(id) {
  if (!confirm('¿Eliminar este equipo? También se eliminarán sus inscripciones y partidos.')) return
  try {
    await eliminarEquipo(id)
    mensaje.value = 'Equipo eliminado correctamente.'
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

onMounted(cargar)
</script>

<template>
  <section class="pagina">
    <div class="encabezado">
      <h1>Equipos</h1>
      <RouterLink v-if="usuario" to="/equipos/nuevo" class="boton">Nuevo equipo</RouterLink>
    </div>
    <div class="filtros">
      <input v-model="busqueda" placeholder="Buscar por nombre" />
      <select v-model="juego">
        <option v-for="j in juegos" :key="j">{{ j }}</option>
      </select>
    </div>
    <p v-if="mensaje" class="correcto">{{ mensaje }}</p>
    <p v-if="cargando">Cargando equipos...</p>
    <div v-else-if="error">
      <p class="error">{{ error }}</p>
      <button @click="cargar">Reintentar</button>
    </div>
    <div v-else-if="equiposFiltrados.length" class="grid">
      <EquipoCard
        v-for="equipo in equiposFiltrados"
        :key="equipo.id"
        :equipo="equipo"
        :puede-gestionar="puedeGestionar(equipo)"
        @eliminar="borrar"
      />
    </div>
    <p v-else>No existen equipos que coincidan con la búsqueda.</p>
  </section>
</template>