import { peticion } from './api'

export function obtenerInscripciones(torneoId) {
  return peticion(`/inscripciones?torneoId=${torneoId}`)
}

export function crearInscripcion(datos) {
  return peticion('/inscripciones', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export function actualizarInscripcion(id, datos) {
  return peticion(`/inscripciones/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}
