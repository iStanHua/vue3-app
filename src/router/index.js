import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/components/layout/index.vue'
import HomePage from '@/views/home.vue'

export const routeContexts = () => {
  let contexts = require.context('./modules', true, /\.js$/)
  return contexts.keys().map(key => contexts(key).default)
}

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    // {
    //   path: '/',
    //   redirect: 'index'
    // },
    ...routeContexts(),
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          meta: {
            title: '首页'
          },
          component: HomePage
        },
        {
          path: '*',
          meta: {
            title: '404'
          },
          component: () => import('@/views/common/notFound.vue')
        }

      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
