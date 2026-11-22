import { createRouter, createWebHistory } from 'vue-router'
import { usuario } from '../services/sesion.js'
import InicioView from '../views/InicioView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/', name: 'inicio', component: InicioView },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/registro', name: 'registro', component: () => import('../views/RegistroView.vue') },
  { path: '/perfil', name: 'perfil', component: () => import('../views/PerfilView.vue'), meta: { requiereAuth: true } },
  { path: '/equipos', name: 'equipos', component: () => import('../views/EquiposView.vue') },
  { path: '/equipos/nuevo', name: 'nuevo-equipo', component: () => import('../views/EquipoFormView.vue'), meta: { requiereAuth: true } },
  { path: '/equipos/:id', name: 'equipo-detalle', component: () => import('../views/EquipoDetalleView.vue') },
  { path: '/equipos/:id/editar', name: 'editar-equipo', component: () => import('../views/EquipoFormView.vue'), meta: { requiereAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiereAuth && !usuario.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.soloAdmin && usuario.value?.rol !== 'admin') {
    return { name: 'inicio' }
  }
  if ((to.name === 'login' || to.name === 'registro') && usuario.value) {
    return { name: 'inicio' }
  }
})

export default router