<script setup>
defineProps({
  partidos: { type: Array, required: true },
  puedeEliminar: { type: Boolean, default: false },
})

const emit = defineEmits(['eliminar'])

function marcador(partido) {
  return partido.resultado
    ? `${partido.resultado.marcadorLocal} - ${partido.resultado.marcadorVisitante}`
    : 'vs'
}
</script>

<template>
  <table class="tabla">
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Torneo</th>
        <th>Ronda</th>
        <th>Partido</th>
        <th>Estado</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="partido in partidos" :key="partido.id">
        <td>{{ new Date(partido.fechaHora).toLocaleString('es-CL') }}</td>
        <td>{{ partido.torneo.nombre }}</td>
        <td>{{ partido.ronda }}</td>
        <td>
          {{ partido.equipoLocal.nombre }}
          <strong>{{ marcador(partido) }}</strong>
          {{ partido.equipoVisitante.nombre }}
        </td>
        <td>{{ partido.estado }}</td>
        <td class="acciones">
          <RouterLink :to="`/partidos/${partido.id}`">Ver</RouterLink>
          <button
            v-if="puedeEliminar"
            class="peligro"
            @click="emit('eliminar', partido.id)"
          >
            Eliminar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
