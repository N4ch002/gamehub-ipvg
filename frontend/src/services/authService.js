import { peticion } from './api'

export function login(datos) {
  return peticion('/auth/login', { method: 'POST', body: JSON.stringify(datos) })
}

export function registrar(datos) {
  return peticion('/auth/registro', { method: 'POST', body: JSON.stringify(datos) })
}

export function obtenerPerfil() {
  return peticion('/auth/perfil')
}

export function actualizarPerfil(datos) {
  return peticion('/auth/perfil', { method: 'PATCH', body: JSON.stringify(datos) })
}