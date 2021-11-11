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
          name: 'Alta cliente',
          path: '/clientes/alta',
          component: () => import('@/views/AddClients'),
        },
        {
          name: 'Ver clientes',
          path: '/clientes/ver',
          component: () => import('@/views/ShowClients'),
        },
        {
          name: 'Ver servicios',
          path: '/servicios/ver',
          component: () => import('@/views/ShowServices'),
        },
        {
          name: 'Ver insumos',
          path: '/insumos/ver',
          component: () => import('@/views/ShowProductos'),
        },
        {
          name: 'Ver stocks',
          path: '/stocks/ver',
          component: () => import('@/views/ShowStocks'),
        },
        {
          name: 'Ver contabilidad',
          path: '/contabilidad/ver',
          component: () => import('@/views/ShowContables'),
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
