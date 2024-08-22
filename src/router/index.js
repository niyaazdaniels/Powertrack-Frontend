import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/calculator',
    name: 'calculator',
    component: () => import('../views/CalculatorView.vue')
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('../views/HelpView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignUpView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
