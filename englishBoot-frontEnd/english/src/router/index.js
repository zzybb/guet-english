import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import getList from '../components/getList.vue'
import UpdateTime from '../components/UpdateTime.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/getList',
    name: 'getScore',
    component: getList
  },
  {
    path: '/UpdateTime',
    name: 'UpdateTime',
    component: UpdateTime
  }

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
