import { createStore } from 'vuex'
import { routeContexts } from '@/router'

import count from './count'

console.log(routeContexts())

export default createStore({
  state: {
    menuList: routeContexts().sort((a, b) => a.sort - b.sort)
  },
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    count,
  },
})
