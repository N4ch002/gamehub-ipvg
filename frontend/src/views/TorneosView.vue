<script setup>
import { computed, onMounted, ref } from 'vue'
import TorneoCard from '../components/TorneoCard.vue'
import { eliminarTorneo, obtenerTorneos } from '../services/torneosService'
import { esAdmin } from '../services/sesion'

const torneos = ref([])
const cargando = ref(true)
const error = ref('')
const mensaje = ref('')
const busqueda = ref('')
const videojuego = ref('Todos')
const estado = ref('Todos')
const modalidad = ref('Todas')
const mostrarFiltros = ref(true)

const videojuegos = computed(() => ['Todos', ...new Set(torneos.value.map(t => t.videojuego))])

const torneosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return torneos.value.filter(t =>
    t.nombre.toLowerCase().includes(texto) &&
    (videojuego.value === 'Todos' || t.videojuego === videojuego.value) &&
    (estado.value === 'Todos' || t.estado === estado.value) &&
    (modalidad.value === 'Todas' || t.modalidad === modalidad.value)
  )
})

async function cargar() {
  try {
    cargando.value = true
    error.value = ''
    torneos.value = await obtenerTorneos()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function borrar(id) {
  if (!confirm('¿Eliminar este torneo? También se eliminarán sus inscripciones y partidos.')) return
  try {
    await eliminarTorneo(id)
    mensaje.value = 'Torneo eliminado correctamente.'
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
      <h1>Torneos</h1>
      <RouterLink v-if="esAdmin" to="/torneos/nuevo" class="boton">Nuevo torneo</RouterLink>
    </div>
    <button class="secundario" @click="mostrarFiltros = !mostrarFiltros">
      {{ mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros' }}
    </button>
    <div v-show="mostrarFiltros" class="filtros">
      <input v-model="busqueda" placeholder="Buscar por nombre" />
      <select v-model="videojuego">
        <option v-for="v in videojuegos" :key="v">{{ v }}</option>
      </select>
      <select v-model="estado">
        <option>Todos</option>
        <option>Abierto</option>
        <option>En curso</option>
        <option>Finalizado</option>
      </select>
      <select v-model="modalidad">
        <option>Todas</option>
        <option>Liga</option>
        <option>Eliminación directa</option>
      </select>
    </div>
    <p v-if="mensaje" class="correcto">{{ mensaje }}</p>
    <p v-if="cargando">Cargando torneos...</p>
    <div v-else-if="error">
      <p class="error">{{ error }}</p>
      <button @click="cargar">Reintentar</button>
    </div>
    <div v-else-if="torneosFiltrados.length" class="grid">
      <TorneoCard
        v-for="torneo in torneosFiltrados"
        :key="torneo.id"
        :torneo="torneo"
        :es-admin="esAdmin"
        @eliminar="borrar"
      />
    </div>
    <p v-else>No existen torneos que coincidan con la búsqueda.</p>
  </section>
</template>
