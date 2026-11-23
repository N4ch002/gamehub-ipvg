<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PartidosTabla from '../components/PartidosTabla.vue'
import InscripcionesPanel from '../components/InscripcionesPanel.vue'
import { obtenerTorneo } from '../services/torneosService'
import { obtenerPartidos } from '../services/partidosService'
import { esAdmin } from '../services/sesion'

const route = useRoute()
const torneo = ref(null)
const partidos = ref([])
const cargando = ref(true)
const error = ref('')

async function cargar() {
  try {
    cargando.value = true
    torneo.value = await obtenerTorneo(route.params.id)
    partidos.value = await obtenerPartidos(route.params.id)
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

onMounted(cargar)
</script>

<template>
  <section class="pagina">
    <p v-if="cargando">Cargando torneo...</p>

    <div v-else-if="error">
      <h2>{{ error }}</h2>
      <RouterLink to="/torneos">Volver a torneos</RouterLink>
    </div>

    <template v-else>
      <div class="panel">
        <span class="etiqueta">{{ torneo.estado }}</span>
        <h1>{{ torneo.nombre }}</h1>
        <p>Videojuego: {{ torneo.videojuego }} · Modalidad: {{ torneo.modalidad }}</p>
        <p>Inicio: {{ torneo.fechaInicio }} · Cierre de inscripción: {{ torneo.cierreInscripcion }}</p>
        <p>Cupo máximo: {{ torneo.cupoMaximo }} equipos</p>

        <div class="acciones">
          <RouterLink v-if="esAdmin" :to="`/torneos/${torneo.id}/editar`">Editar</RouterLink>
          <RouterLink to="/torneos">Volver</RouterLink>
        </div>
      </div>

      <InscripcionesPanel :torneo="torneo" />

      <section class="panel">
        <h2>Partidos</h2>
        <PartidosTabla v-if="partidos.length" :partidos="partidos" />
        <p v-else>Aún no hay partidos programados en este torneo.</p>
      </section>
    </template>
  </section>
</template>
