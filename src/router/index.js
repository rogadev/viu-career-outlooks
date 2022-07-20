// USES VUE-ROUTER@4
import { createWebHistory, createRouter } from 'vue-router'

// ROUTE COMPONENTS (Lazy Loading)
const Home = () => import('../views/Home.vue')
const SearchProgram = () => import('../views/SearchProgram.vue')
const SearchKeywords = () => import('../views/SearchKeywords.vue')
const PrefetchSearchProgram = () => import('../views/PrefetchSearchProgram.vue')
const PrefetchSearchKeywords = () =>
  import('../views/PrefetchSearchKeywords.vue')
const NotFound = () => import('../views/NotFound.vue')

// ROUTES
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/search-by-program',
    name: 'SearchProgram',
    component: SearchProgram,
  },
  {
    path: '/search-by-program/:nid',
    name: 'SearchProgramWithNid',
    component: SearchProgram,
  },
  {
    path: '/search-by-keywords',
    name: 'SearchKeywords',
    component: SearchKeywords,
  },

  { path: '/*', name: 'NotFound', component: NotFound },
]

// ROUTER
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
