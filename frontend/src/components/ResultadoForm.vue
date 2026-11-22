<script setup>
import { ref } from 'vue'
import { actualizarResultado, crearResultado } from '../services/resultadosService'

const props = defineProps({
  partido: { type: Object, required: true },
})

const emit = defineEmits(['guardado'])

const marcadorLocal = ref(props.partido.resultado?.marcadorLocal ?? 0)
const marcadorVisitante = ref(props.partido.resultado?.marcadorVisitante ?? 0)
const error = ref('')
const guardando = ref(false)

async function guardar() {
  error.value = ''

  if (
    !Number.isInteger(marcadorLocal.value) ||
    !Number.isInteger(marcadorVisitante.value) ||
    marcadorLocal.value < 0 ||
    marcadorVisitante.value < 0
  ) {
    error.value = 'Los marcadores deben ser números enteros mayores o iguales a 0.'
    return
  }

  if (
    props.partido.torneo.modalidad === 'Eliminación directa' &&
    marcadorLocal.value === marcadorVisitante.value
  ) {
    error.value = 'En eliminación directa el partido no puede terminar en empate.'
    return
  }

  try {
    guardando.value = true

    const datos = {
      marcadorLocal: marcadorLocal.value,
      marcadorVisitante: marcadorVisitante.value,
    }

    if (props.partido.resultado) {
      await actualizarResultado(props.partido.resultado.id, datos)
    } else {
      await crearResultado({ partidoId: props.partido.id, ...datos })
    }

    emit('guardado')
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <form class="formulario" @submit.prevent="guardar">
    <h3>
      {{ partido.resultado ? 'Corregir resultado oficial' : 'Registrar resultado oficial' }}
    </h3>

    <label>Marcador {{ partido.equipoLocal.nombre }}</label>
    <input v-model.number="marcadorLocal" type="number" min="0" />

    <label>Marcador {{ partido.equipoVisitante.nombre }}</label>
    <input v-model.number="marcadorVisitante" type="number" min="0" />

    <p v-if="error" class="error">{{ error }}</p>

    <button :disabled="guardando">
      {{ guardando ? 'Guardando...' : 'Guardar resultado' }}
    </button>
  </form>
</template>
