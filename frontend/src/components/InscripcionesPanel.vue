<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  actualizarInscripcion,
  crearInscripcion,
  obtenerInscripciones,
} from '../services/inscripcionesService'
import { obtenerEquipos } from '../services/equiposService'
import { esAdmin, usuario } from '../services/sesion'

const props = defineProps({
  torneo: { type: Object, required: true },
})

const inscripciones = ref([])
const equipos = ref([])
const equipoId = ref('')
const cargando = ref(true)
const error = ref('')
const mensaje = ref('')

const ocupados = computed(() =>
  inscripciones.value.filter(i => i.estado !== 'Rechazada').length
)

const misEquipos = computed(() =>
  equipos.value.filter(e =>
    esAdmin.value || e.capitanId === usuario.value?.id
  )
)

async function cargar() {
  try {
    cargando.value = true
    error.value = ''
    inscripciones.value = await obtenerInscripciones(props.torneo.id)

    if (usuario.value) {
      equipos.value = await obtenerEquipos()
    }
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function inscribir() {
  mensaje.value = ''
  error.value = ''

  if (!equipoId.value) {
    error.value = 'Seleccione un equipo.'
    return
  }

  try {
    await crearInscripcion({
      torneoId: props.torneo.id,
      equipoId: equipoId.value,
    })

    mensaje.value = 'Inscripción enviada correctamente. Queda pendiente de aprobación.'
    equipoId.value = ''
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

async function cambiarEstado(inscripcion, estado) {
  mensaje.value = ''
  error.value = ''

  try {
    await actualizarInscripcion(inscripcion.id, { estado })
    mensaje.value = `Inscripción de ${inscripcion.equipo.nombre} marcada como ${estado}.`
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

onMounted(cargar)
</script>

<template>
  <section class="panel">
    <h2>Inscripciones ({{ ocupados }} / {{ torneo.cupoMaximo }} cupos)</h2>

    <p v-if="cargando">Cargando inscripciones...</p>

    <template v-else>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="mensaje" class="correcto">{{ mensaje }}</p>

      <table v-if="inscripciones.length" class="tabla">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th v-if="esAdmin"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inscripcion in inscripciones" :key="inscripcion.id">
            <td>{{ inscripcion.equipo.nombre }}</td>
            <td>{{ new Date(inscripcion.fecha).toLocaleDateString('es-CL') }}</td>
            <td>{{ inscripcion.estado }}</td>
            <td v-if="esAdmin" class="acciones">
              <button
                v-if="inscripcion.estado !== 'Aceptada'"
                @click="cambiarEstado(inscripcion, 'Aceptada')"
              >
                Aceptar
              </button>
              <button
                v-if="inscripcion.estado !== 'Rechazada'"
                class="secundario"
                @click="cambiarEstado(inscripcion, 'Rechazada')"
              >
                Rechazar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>Este torneo aún no tiene equipos inscritos.</p>

      <form
        v-if="usuario && misEquipos.length"
        class="filtros"
        @submit.prevent="inscribir"
      >
        <select v-model="equipoId">
          <option value="">Seleccione su equipo</option>
          <option v-for="e in misEquipos" :key="e.id" :value="e.id">
            {{ e.nombre }}
          </option>
        </select>
        <button>Inscribir equipo</button>
      </form>

      <p v-else-if="usuario">
        Debes ser capitán de un equipo para inscribirlo.
        <RouterLink to="/equipos/nuevo">Crear equipo</RouterLink>
      </p>

      <p v-else>
        <RouterLink to="/login">Inicia sesión</RouterLink>
        para inscribir a tu equipo.
      </p>
    </template>
  </section>
</template>
