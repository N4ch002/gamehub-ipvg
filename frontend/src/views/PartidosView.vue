<script setup>
import { computed, onMounted, ref } from 'vue'
import PartidosTabla from '../components/PartidosTabla.vue'
import { eliminarPartido, obtenerPartidos } from '../services/partidosService'
import { obtenerTorneos } from '../services/torneosService'
import { esAdmin } from '../services/sesion'

const partidos = ref([])
const torneos = ref([])
const cargando = ref(true)
const error = ref('')
const mensaje = ref('')
const busqueda = ref('')
const torneoId = ref('')
const estado = ref('Todos')

const partidosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()

  return partidos.value.filter((partido) => {
    const coincideBusqueda =
      partido.equipoLocal.nombre.toLowerCase().includes(texto) ||
      partido.equipoVisitante.nombre.toLowerCase().includes(texto)

    const coincideTorneo =
      torneoId.value === '' ||
      String(partido.torneoId) === String(torneoId.value)

    const coincideEstado =
      estado.value === 'Todos' || partido.estado === estado.value

    return coincideBusqueda && coincideTorneo && coincideEstado
  })
})

async function cargarDatos() {
  try {
    cargando.value = true
    error.value = ''

    const [datosPartidos, datosTorneos] = await Promise.all([
      obtenerPartidos(),
      obtenerTorneos(),
    ])

    partidos.value = datosPartidos
    torneos.value = datosTorneos
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function eliminar(id) {
  if (!confirm('¿Está seguro de que desea eliminar este partido?')) return

  try {
    await eliminarPartido(id)
    mensaje.value = 'Partido eliminado correctamente.'
    await cargarDatos()
  } catch (e) {
    error.value = e.message
  }
}

onMounted(cargarDatos)
</script>

<template>
  <section class="pagina">
    <div class="encabezado-pagina">
      <div>
        <h1>Partidos</h1>
        <p>Consulta los encuentros programados y sus resultados.</p>
      </div>

      <RouterLink
        v-if="esAdmin"
        to="/partidos/nuevo"
        class="boton"
      >
        Programar partido
      </RouterLink>
    </div>

    <div class="panel">
      <div class="filtros">
        <input
          v-model="busqueda"
          type="search"
          placeholder="Buscar por equipo..."
        />

        <select v-model="torneoId">
          <option value="">Todos los torneos</option>
          <option
            v-for="torneo in torneos"
            :key="torneo.id"
            :value="torneo.id"
          >
            {{ torneo.nombre }}
          </option>
        </select>

        <select v-model="estado">
          <option value="Todos">Todos los estados</option>
          <option value="Programado">Programado</option>
          <option value="En curso">En curso</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>

      <p v-if="mensaje" class="correcto">{{ mensaje }}</p>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="cargando">Cargando partidos...</p>

      <template v-else>
        <PartidosTabla
          v-if="partidosFiltrados.length"
          :partidos="partidosFiltrados"
          :puede-eliminar="esAdmin"
          @eliminar="eliminar"
        />

        <p v-else>No se encontraron partidos.</p>
      </template>
    </div>
  </section>
</template>
