<script setup>
defineProps({
  filas: { type: Array, required: true },
})
</script>

<template>
  <table v-if="filas.length" class="tabla">
    <thead>
      <tr>
        <th>#</th>
        <th>Equipo</th>
        <th>PJ</th>
        <th>PG</th>
        <th>PE</th>
        <th>PP</th>
        <th>Pts</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(fila, indice) in filas" :key="fila.equipoId">
        <td>{{ indice + 1 }}</td>
        <td>{{ fila.equipo }}</td>
        <td>{{ fila.jugados }}</td>
        <td>{{ fila.ganados }}</td>
        <td>{{ fila.empatados }}</td>
        <td>{{ fila.perdidos }}</td>
        <td><strong>{{ fila.puntos }}</strong></td>
      </tr>
    </tbody>
  </table>

  <p v-else>Este torneo aún no tiene equipos aceptados.</p>
</template>
