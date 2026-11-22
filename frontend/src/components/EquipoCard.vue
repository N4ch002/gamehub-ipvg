<script setup>
defineProps({
  equipo: { type: Object, required: true },
  puedeGestionar: { type: Boolean, default: false },
})
const emit = defineEmits(['eliminar'])
</script>

<template>
  <article class="tarjeta">
    <span class="etiqueta">{{ equipo.estado }}</span>
    <h3>{{ equipo.nombre }}</h3>
    <p>Juego preferido: {{ equipo.juegoPreferido }}</p>
    <p>Capitán: {{ equipo.capitan.alias }}</p>
    <p>Integrantes: {{ equipo.integrantes.length }}</p>
    <div class="acciones">
      <RouterLink :to="`/equipos/${equipo.id}`">Ver detalle</RouterLink>
      <template v-if="puedeGestionar">
        <RouterLink :to="`/equipos/${equipo.id}/editar`">Editar</RouterLink>
        <button class="peligro" @click="emit('eliminar', equipo.id)">Eliminar</button>
      </template>
    </div>
  </article>
</template>