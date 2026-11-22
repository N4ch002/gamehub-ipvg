<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registrar } from '../services/authService'

const router = useRouter()
const form = ref({ nombre: '', alias: '', correo: '', password: '' })
const error = ref('')
const mensaje = ref('')
const guardando = ref(false)

function validar() {
  if (form.value.nombre.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (form.value.alias.length < 3) return 'El alias debe tener al menos 3 caracteres.'
  if (!form.value.correo.includes('@')) return 'Ingrese un correo válido.'
  if (form.value.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  return ''
}

async function guardar() {
  mensaje.value = ''
  error.value = validar()
  if (error.value) return
  try {
    guardando.value = true
    await registrar(form.value)
    mensaje.value = 'Cuenta creada correctamente. Ahora puedes iniciar sesión.'
    setTimeout(() => router.push('/login'), 1200)
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <section class="pagina">
    <h1>Crear cuenta</h1>
    <form class="formulario" @submit.prevent="guardar">
      <label>Nombre</label>
      <input v-model="form.nombre" />
      <label>Alias (nombre de jugador)</label>
      <input v-model="form.alias" />
      <label>Correo electrónico</label>
      <input v-model="form.correo" type="email" />
      <label>Contraseña</label>
      <input v-model="form.password" type="password" />
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="mensaje" class="correcto">{{ mensaje }}</p>
      <button :disabled="guardando">{{ guardando ? 'Guardando...' : 'Registrarme' }}</button>
    </form>
  </section>
</template>