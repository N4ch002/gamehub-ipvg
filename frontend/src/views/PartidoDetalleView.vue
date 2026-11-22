<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obtenerPartido, eliminarPartido } from '../services/partidosService'
import { esAdmin } from '../services/sesion'
import ResultadoForm from '../components/ResultadoForm.vue'

const route = useRoute()
const router = useRouter()

const partido = ref(null)
const cargando = ref(true)
const error = ref('')
const mensaje = ref('')

async function cargarPartido() {
  try {
    cargando.value = true
    error.value = ''
    partido.value = await obtenerPartido(route.params.id)
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function eliminar() {
  if (!confirm('¿Está seguro de que desea eliminar este partido?')) return

  try {
    await eliminarPartido(partido.value.id)
    router.push('/partidos')
  } catch (e) {
    error.value = e.message
  }
}

async function resultadoGuardado() {
  mensaje.value = 'Resultado guardado correctamente.'
  await cargarPartido()
}

onMounted(cargarPartido)
</script>

<template>
  <section class="pagina">
    <p v-if="cargando">Cargando información del partido...</p>

    <div v-else-if="error" class="panel">
      <p class="error">{{ error }}</p>
      <RouterLink to="/partidos">Volver a partidos</RouterLink>
    </div>

    <template v-else-if="partido">
      <div class="panel">
        <span class="etiqueta">{{ partido.estado }}</span>
        <h1>Detalle del partido</h1>

        <p>
          <strong>Torneo:</strong>
          {{ partido.torneo.nombre }}
        </p>

        <p>
          <strong>Ronda:</strong>
          {{ partido.ronda }}
        </p>

        <p>
          <strong>Fecha y hora:</strong>
          {{ new Date(partido.fechaHora).toLocaleString('es-CL') }}
        </p>

        <div class="panel">
          <h2>Encuentro</h2>

          <div class="acciones">
            <h3>{{ partido.equipoLocal.nombre }}</h3>

            <strong class="marcador">
              <template v-if="partido.resultado">
                {{ partido.resultado.marcadorLocal }}
                -
                {{ partido.resultado.marcadorVisitante }}
              </template>
              <template v-else>VS</template>
            </strong>

            <h3>{{ partido.equipoVisitante.nombre }}</h3>
          </div>

          <p v-if="partido.resultado?.ganador">
            <strong>Ganador:</strong>
            {{ partido.resultado.ganador.nombre }}
          </p>

          <p v-else-if="partido.resultado">
            El encuentro terminó en empate.
          </p>

          <p v-else>
            El resultado todavía no ha sido registrado.
          </p>
        </div>

        <p v-if="mensaje" class="correcto">{{ mensaje }}</p>

        <div class="acciones">
          <RouterLink to="/partidos">Volver a partidos</RouterLink>

          <button
            v-if="esAdmin && !partido.resultado"
            class="peligro"
            @click="eliminar"
          >
            Eliminar partido
          </button>
        </div>
      </div>

      <div v-if="esAdmin" class="panel">
        <ResultadoForm
          :partido="partido"
          @guardado="resultadoGuardado"
        />
      </div>
    </template>
  </section>
</template>
