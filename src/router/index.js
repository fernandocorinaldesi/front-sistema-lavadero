import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/Index'),
      children: [
        // Dashboard
        {
          name: 'Main',
          path: '',
          component: () => import('@/views/Home'),
        },
        {
          name: 'Ingresar orden',
          path: '/ordenes/ingresar',
          component: () => import('@/views/Orders'),
        },
        {
          name: 'Ver ordenes',
          path: '/ordenes/ver',
          component: () => import('@/views/ShowOrders'),
        },
        {
          name: 'About',
          path: '/About',
          component: () => import('@/views/About'),
        },

      ],
    },
  ],
})
