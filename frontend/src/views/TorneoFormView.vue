<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { actualizarTorneo, crearTorneo, obtenerTorneo } from '../services/torneosService'

const route = useRoute()
const router = useRouter()
const esEdicion = computed(() => Boolean(route.params.id))

const torneo = ref({
  nombre: '',
  videojuego: '',
  modalidad: 'Liga',
  fechaInicio: '',
  cierreInscripcion: '',
  cupoMaximo: 8,
  estado: 'Abierto',
})

const cargando = ref(false)
const guardando = ref(false)
const error = ref('')
const mensaje = ref('')

function validar() {
  const t = torneo.value

  if (t.nombre.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (!t.videojuego) return 'Debe indicar el videojuego.'
  if (!t.fechaInicio || !t.cierreInscripcion) return 'Debe indicar la fecha de inicio y el cierre de inscripción.'
  if (t.cierreInscripcion > t.fechaInicio) return 'El cierre de inscripción no puede ser posterior a la fecha de inicio.'
  if (!Number.isInteger(t.cupoMaximo) || t.cupoMaximo < 2) return 'El cupo máximo debe ser un número entero mayor o igual a 2.'

  return ''
}

async function guardar() {
  mensaje.value = ''
  error.value = validar()

  if (error.value) return

  try {
    guardando.value = true

    if (esEdicion.value) {
      await actualizarTorneo(route.params.id, torneo.value)
    } else {
      await crearTorneo(torneo.value)
    }

    mensaje.value = 'Torneo guardado correctamente.'
    setTimeout(() => router.push('/torneos'), 1000)
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  if (!esEdicion.value) return

  try {
    cargando.value = true
    torneo.value = await obtenerTorneo(route.params.id)
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
})
</script>

<template>
  <section class="pagina">
    <h1>{{ esEdicion ? 'Editar torneo' : 'Nuevo torneo' }}</h1>

    <p v-if="cargando">Cargando torneo...</p>

    <form v-else class="formulario" @submit.prevent="guardar">
      <label>Nombre</label>
      <input v-model="torneo.nombre" />

      <label>Videojuego</label>
      <input v-model="torneo.videojuego" />

      <label>Modalidad</label>
      <select v-model="torneo.modalidad">
        <option>Liga</option>
        <option>Eliminación directa</option>
      </select>

      <label>Fecha de inicio</label>
      <input v-model="torneo.fechaInicio" type="date" />

      <label>Cierre de inscripción</label>
      <input v-model="torneo.cierreInscripcion" type="date" />

      <label>Cupo máximo de equipos</label>
      <input v-model.number="torneo.cupoMaximo" type="number" min="2" />

      <label>Estado</label>
      <select v-model="torneo.estado">
        <option>Abierto</option>
        <option>En curso</option>
        <option>Finalizado</option>
      </select>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="mensaje" class="correcto">{{ mensaje }}</p>

      <button :disabled="guardando">
        {{ guardando ? 'Guardando...' : 'Guardar torneo' }}
      </button>
    </form>
  </section>
</template>
