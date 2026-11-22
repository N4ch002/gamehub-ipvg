import { cerrarSesion } from './sesion'

const API = 'http://localhost:3000'

export async function peticion(ruta, opciones = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(`${API}${ruta}`, { ...opciones, headers })
  } catch {
    throw new Error('No fue posible conectar con la API. Verifique que el backend esté en ejecución.')
  }

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    if (respuesta.status === 401 && token) cerrarSesion()
    const mensaje = Array.isArray(datos?.message)
      ? datos.message.join(', ')
      : datos?.message
    throw new Error(mensaje || `Error HTTP: ${respuesta.status}`)
  }
  return datos
}