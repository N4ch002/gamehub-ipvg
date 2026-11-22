import { peticion } from './api'

export function obtenerRanking(torneoId) {
  return peticion(`/ranking/${torneoId}`)
}
