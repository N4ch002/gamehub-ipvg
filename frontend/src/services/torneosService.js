import { peticion } from './api'

export function obtenerTorneos() {
  return peticion('/torneos')
}

export function obtenerTorneo(id) {
  return peticion(`/torneos/${id}`)
}

export function crearTorneo(datos) {
  return peticion('/torneos', { method: 'POST', body: JSON.stringify(datos) })
}

export function actualizarTorneo(id, datos) {
  return peticion(`/torneos/${id}`, { method: 'PATCH', body: JSON.stringify(datos) })
}

export function eliminarTorneo(id) {
  return peticion(`/torneos/${id}`, { method: 'DELETE' })
}
