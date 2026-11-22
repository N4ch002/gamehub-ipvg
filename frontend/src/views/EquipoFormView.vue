<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { actualizarEquipo, crearEquipo, obtenerEquipo } from '../services/equiposService'
import { obtenerUsuarios } from '../services/usuariosService'
import { usuario } from '../services/sesion'

const route = useRoute()
const router = useRouter()
const esEdicion = computed(() => Boolean(route.params.id))
const equipo = ref({ nombre: '', juegoPreferido: '', estado: 'Activo', integrantesIds: [] })
const capitanId = ref(usuario.value?.id)
const usuarios = ref([])
const cargando = ref(true)
const guardando = ref(false)
const error = ref('')
const mensaje = ref('')

const candidatos = computed(() => usuarios.value.filter(u => u.id !== capitanId.value))

function validar() {
  if (equipo.value.nombre.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (!equipo.value.juegoPreferido) return 'Debe indicar el juego preferido.'
  return ''
}

async function guardar() {
  mensaje.value = ''
  error.value = validar()
  if (error.value) return
  try {
    guardando.value = true
    if (esEdicion.value) {
      await actualizarEquipo(route.params.id, equipo.value)
    } else {
      await crearEquipo(equipo.value)
    }
    mensaje.value = 'Equipo guardado correctamente.'
    setTimeout(() => router.push('/equipos'), 1000)
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  try {
    usuarios.value = await obtenerUsuarios()
    if (esEdicion.value) {
      const datos = await obtenerEquipo(route.params.id)
      capitanId.value = datos.capitanId
      equipo.value = {
        nombre: datos.nombre,
        juegoPreferido: datos.juegoPreferido,
        estado: datos.estado,
        integrantesIds: datos.integrantes.map(i => i.id).filter(id => id !== datos.capitanId),
      }
    }
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
})
</script>

<template>
  <section class="pagina">
    <h1>{{ esEdicion ? 'Editar equipo' : 'Nuevo equipo' }}</h1>
    <p v-if="cargando">Cargando...</p>
    <form v-else class="formulario" @submit.prevent="guardar">
      <label>Nombre del equipo</label>
      <input v-model="equipo.nombre" />
      <label>Juego preferido</label>
      <input v-model="equipo.juegoPreferido" placeholder="Valorant, EA Sports FC..." />
      <label>Estado</label>
      <select v-model="equipo.estado">
        <option>Activo</option>
        <option>Inactivo</option>
      </select>
      <label>Integrantes (el capitán se agrega automáticamente)</label>
      <div class="checks">
        <label v-for="u in candidatos" :key="u.id">
          <input v-model="equipo.integrantesIds" type="checkbox" :value="u.id" />
          {{ u.nombre }} ({{ u.alias }})
        </label>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="mensaje" class="correcto">{{ mensaje }}</p>
      <button :disabled="guardando">{{ guardando ? 'Guardando...' : 'Guardar equipo' }}</button>
    </form>
  </section>
</template>