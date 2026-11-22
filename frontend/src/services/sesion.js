import { computed, ref } from 'vue'

const guardado = localStorage.getItem('usuario')
export const usuario = ref(guardado ? JSON.parse(guardado) : null)
export const esAdmin = computed(() => usuario.value?.rol === 'admin')

export function iniciarSesion(token, datos) {
  localStorage.setItem('token', token)
  localStorage.setItem('usuario', JSON.stringify(datos))
  usuario.value = datos
}

export function actualizarUsuario(datos) {
  localStorage.setItem('usuario', JSON.stringify(datos))
  usuario.value = datos
}

export function cerrarSesion() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  usuario.value = null
}