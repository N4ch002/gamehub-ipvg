<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerTorneos } from '../services/torneosService'
import { obtenerInscripciones } from '../services/inscripcionesService'
import { crearPartido } from '../services/partidosService'

const router = useRouter()

const torneos = ref([])
const inscripciones = ref([])
const cargando = ref(false)
const guardando = ref(false)
const error = ref('')

const formulario = ref({
  torneoId: '',
  equipoLocalId: '',
  equipoVisitanteId: '',
  fechaHora: '',
  ronda: '',
})

const equiposAceptados = computed(() =>
  inscripciones.value
    .filter((inscripcion) => inscripcion.estado === 'Aceptada')
    .map((inscripcion) => inscripcion.equipo),
)

const equiposVisitantes = computed(() =>
  equiposAceptados.value.filter(
    (equipo) => String(equipo.id) !== String(formulario.value.equipoLocalId),
  ),
)

watch(
  () => formulario.value.torneoId,
  async (torneoId) => {
    formulario.value.equipoLocalId = ''
    formulario.value.equipoVisitanteId = ''
    inscripciones.value = []

    if (!torneoId) return

    try {
      cargando.value = true
      inscripciones.value = await obtenerInscripciones(torneoId)
    } catch (e) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  },
)

watch(
  () => formulario.value.equipoLocalId,
  () => {
    if (
      String(formulario.value.equipoLocalId) ===
      String(formulario.value.equipoVisitanteId)
    ) {
      formulario.value.equipoVisitanteId = ''
    }
  },
)

async function cargarTorneos() {
  try {
    torneos.value = await obtenerTorneos()
  } catch (e) {
    error.value = e.message
  }
}

async function guardar() {
  error.value = ''

  if (
    !formulario.value.torneoId ||
    !formulario.value.equipoLocalId ||
    !formulario.value.equipoVisitanteId ||
    !formulario.value.fechaHora ||
    !formulario.value.ronda.trim()
  ) {
    error.value = 'Complete todos los campos para programar el partido.'
    return
  }

  if (
    String(formulario.value.equipoLocalId) ===
    String(formulario.value.equipoVisitanteId)
  ) {
    error.value = 'Seleccione dos equipos diferentes.'
    return
  }

  try {
    guardando.value = true

    await crearPartido({
      torneoId: Number(formulario.value.torneoId),
      equipoLocalId: Number(formulario.value.equipoLocalId),
      equipoVisitanteId: Number(formulario.value.equipoVisitanteId),
      fechaHora: new Date(formulario.value.fechaHora).toISOString(),
      ronda: formulario.value.ronda.trim(),
    })

    alert('Partido programado correctamente.')
    router.push('/partidos')
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

onMounted(cargarTorneos)
</script>

<template>
  <section class="pagina">
    <div class="panel">
      <h1>Programar partido</h1>
      <p>Seleccione el torneo, los equipos participantes y los datos del encuentro.</p>

      <form class="formulario" @submit.prevent="guardar">
        <label for="torneo">Torneo</label>
        <select id="torneo" v-model="formulario.torneoId" required>
          <option value="">Seleccione un torneo</option>
          <option v-for="torneo in torneos" :key="torneo.id" :value="torneo.id">
            {{ torneo.nombre }}
          </option>
        </select>

        <p v-if="formulario.torneoId && cargando">Cargando equipos inscritos...</p>

        <template v-if="formulario.torneoId && !cargando">
          <label for="equipoLocal">Equipo local</label>
          <select id="equipoLocal" v-model="formulario.equipoLocalId" required>
            <option value="">Seleccione el equipo local</option>
            <option
              v-for="equipo in equiposAceptados"
              :key="equipo.id"
              :value="equipo.id"
            >
              {{ equipo.nombre }}
            </option>
          </select>

          <label for="equipoVisitante">Equipo visitante</label>
          <select
            id="equipoVisitante"
            v-model="formulario.equipoVisitanteId"
            required
          >
            <option value="">Seleccione el equipo visitante</option>
            <option
              v-for="equipo in equiposVisitantes"
              :key="equipo.id"
              :value="equipo.id"
            >
              {{ equipo.nombre }}
            </option>
          </select>

          <p v-if="!equiposAceptados.length">
            Este torneo todavía no tiene equipos con inscripción aceptada.
          </p>
        </template>

        <label for="fechaHora">Fecha y hora</label>
        <input
          id="fechaHora"
          v-model="formulario.fechaHora"
          type="datetime-local"
          required
        />

        <label for="ronda">Ronda o etapa</label>
        <input
          id="ronda"
          v-model="formulario.ronda"
          type="text"
          maxlength="100"
          placeholder="Ej. Semifinal"
          required
        />

        <p v-if="error" class="error">{{ error }}</p>

        <div class="acciones">
          <button type="submit" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Programar partido' }}
          </button>
          <button type="button" class="secundario" @click="router.push('/partidos')">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
