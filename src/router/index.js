import { createRouter,createWebHistory} from 'vue-router'

const routes = [
   /*  {
   path:'',na
    }, */
  {
    path: '/',
    name: 'home',
    component:()=> import('../components/home-page.vue')
  },
  {
    path: '/state/:request',
    name: 'detailPage', 
    component:()=> import('../components/detail-page.vue')
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes
})

export default router