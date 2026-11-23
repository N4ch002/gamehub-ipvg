<script setup>
import { onMounted, ref, watch } from 'vue'
import { obtenerTorneos } from '../services/torneosService'
import { obtenerRanking } from '../services/rankingService'
import TablaRanking from '../components/TablaRanking.vue'

const torneos = ref([])
const torneoId = ref('')
const ranking = ref([])
const nombreTorneo = ref('')
const cargando = ref(false)
const error = ref('')

async function cargarTorneos() {
  try {
    torneos.value = await obtenerTorneos()

    if (torneos.value.length) {
      torneoId.value = String(torneos.value[0].id)
    }
  } catch (e) {
    error.value = e.message
  }
}

async function cargarRanking(id) {
  if (!id) {
    ranking.value = []
    nombreTorneo.value = ''
    return
  }

  try {
    cargando.value = true
    error.value = ''

    const datos = await obtenerRanking(id)
    ranking.value = datos.ranking
    nombreTorneo.value = datos.torneo.nombre
  } catch (e) {
    error.value = e.message
    ranking.value = []
  } finally {
    cargando.value = false
  }
}

watch(torneoId, cargarRanking)
onMounted(cargarTorneos)
</script>

<template>
  <section class="pagina">
    <div class="panel">
      <h1>Ranking de torneos</h1>
      <p>Consulta la clasificación de los equipos según sus resultados.</p>

      <label for="torneoRanking">Seleccionar torneo</label>
      <select id="torneoRanking" v-model="torneoId">
        <option value="">Seleccione un torneo</option>
        <option
          v-for="torneo in torneos"
          :key="torneo.id"
          :value="String(torneo.id)"
        >
          {{ torneo.nombre }}
        </option>
      </select>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="cargando">Calculando posiciones...</p>

      <template v-else-if="torneoId">
        <h2 v-if="nombreTorneo">{{ nombreTorneo }}</h2>
        <TablaRanking :filas="ranking" />
      </template>

      <p v-else-if="!torneos.length">
        No hay torneos disponibles para consultar.
      </p>
    </div>
  </section>
</template>
