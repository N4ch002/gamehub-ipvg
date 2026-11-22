import { peticion } from './api'

export function obtenerEquipos() {
  return peticion('/equipos')
}

export function obtenerEquipo(id) {
  return peticion(`/equipos/${id}`)
}

export function crearEquipo(datos) {
  return peticion('/equipos', { method: 'POST', body: JSON.stringify(datos) })
}

export function actualizarEquipo(id, datos) {
  return peticion(`/equipos/${id}`, { method: 'PATCH', body: JSON.stringify(datos) })
}

export function eliminarEquipo(id) {
  return peticion(`/equipos/${id}`, { method: 'DELETE' })
}