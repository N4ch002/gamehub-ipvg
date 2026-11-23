import { peticion } from './api'

export function obtenerResultados() {
  return peticion('/resultados')
}

export function obtenerResultado(id) {
  return peticion(`/resultados/${id}`)
}

export function crearResultado(datos) {
  return peticion('/resultados', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export function actualizarResultado(id, datos) {
  return peticion(`/resultados/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}
