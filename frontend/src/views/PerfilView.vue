<script setup>
import { onMounted, ref } from 'vue'
import { actualizarPerfil, obtenerPerfil } from '../services/authService'
import { actualizarUsuario } from '../services/sesion'

const perfil = ref({ nombre: '', alias: '', correo: '', rol: '' })
const cargando = ref(true)
const guardando = ref(false)
const error = ref('')
const mensaje = ref('')

async function cargar() {
  try {
    cargando.value = true
    perfil.value = await obtenerPerfil()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function guardar() {
  mensaje.value = ''
  error.value = ''
  if (perfil.value.nombre.length < 3 || perfil.value.alias.length < 3) {
    error.value = 'Nombre y alias deben tener al menos 3 caracteres.'
    return
  }
  try {
    guardando.value = true
    const actualizado = await actualizarPerfil({ nombre: perfil.value.nombre, alias: perfil.value.alias })
    actualizarUsuario(actualizado)
    mensaje.value = 'Perfil actualizado correctamente.'
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

onMounted(cargar)
</script>

<template>
  <section class="pagina">
    <h1>Mi perfil</h1>
    <p v-if="cargando">Cargando perfil...</p>
    <form v-else class="formulario" @submit.prevent="guardar">
      <p>Correo: <strong>{{ perfil.correo }}</strong> · Rol: <strong>{{ perfil.rol }}</strong></p>
      <label>Nombre</label>
      <input v-model="perfil.nombre" />
      <label>Alias</label>
      <input v-model="perfil.alias" />
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="mensaje" class="correcto">{{ mensaje }}</p>
      <button :disabled="guardando">{{ guardando ? 'Guardando...' : 'Guardar cambios' }}</button>
    </form>
  </section>
</template>