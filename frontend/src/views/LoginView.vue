<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../services/authService'
import { iniciarSesion } from '../services/sesion'

const router = useRouter()
const route = useRoute()
const correo = ref('')
const password = ref('')
const error = ref('')
const cargando = ref(false)

async function ingresar() {
  error.value = ''
  if (!correo.value || !password.value) {
    error.value = 'Debe ingresar correo y contraseña.'
    return
  }
  try {
    cargando.value = true
    const respuesta = await login({ correo: correo.value, password: password.value })
    iniciarSesion(respuesta.access_token, respuesta.usuario)
    router.push(route.query.redirect || '/torneos')
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <section class="pagina">
    <h1>Iniciar sesión</h1>
    <form class="formulario" @submit.prevent="ingresar">
      <label>Correo electrónico</label>
      <input v-model="correo" type="email" />
      <label>Contraseña</label>
      <input v-model="password" type="password" />
      <p v-if="error" class="error">{{ error }}</p>
      <button :disabled="cargando">{{ cargando ? 'Ingresando...' : 'Ingresar' }}</button>
    </form>
    <p>¿No tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink></p>
  </section>
</template>