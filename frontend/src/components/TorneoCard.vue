<script setup>
defineProps({
  torneo: { type: Object, required: true },
  esAdmin: { type: Boolean, default: false },
})

const emit = defineEmits(['eliminar'])
</script>

<template>
  <article class="tarjeta">
    <span class="etiqueta">{{ torneo.estado }}</span>
    <h3>{{ torneo.nombre }}</h3>
    <p>{{ torneo.videojuego }} · {{ torneo.modalidad }}</p>
    <p>Inicio: {{ torneo.fechaInicio }}</p>
    <p>Cierre de inscripción: {{ torneo.cierreInscripcion }}</p>
    <p>Cupo máximo: {{ torneo.cupoMaximo }} equipos</p>

    <div class="acciones">
      <RouterLink :to="`/torneos/${torneo.id}`">Ver detalle</RouterLink>
      <template v-if="esAdmin">
        <RouterLink :to="`/torneos/${torneo.id}/editar`">Editar</RouterLink>
        <button class="peligro" @click="emit('eliminar', torneo.id)">Eliminar</button>
      </template>
    </div>
  </article>
</template>
