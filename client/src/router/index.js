import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RestaurantsView from '../views/RestaurantsView.vue'
import AboutView from '../views/AboutView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/restaurants', name: 'restaurants', component: RestaurantsView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/admin', name: 'admin', component: AdminView }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})