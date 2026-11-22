import { peticion } from './api'

export function obtenerUsuarios() {
  return peticion('/usuarios')
}