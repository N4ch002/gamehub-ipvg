import { peticion } from './api'

export function obtenerPartidos(torneoId) {
  return peticion(torneoId ? `/partidos?torneoId=${torneoId}` : '/partidos')
}

export function obtenerPartido(id) {
  return peticion(`/partidos/${id}`)
}

export function crearPartido(datos) {
  return peticion('/partidos', { method: 'POST', body: JSON.stringify(datos) })
}

export function eliminarPartido(id) {
  return peticion(`/partidos/${id}`, { method: 'DELETE' })
}
