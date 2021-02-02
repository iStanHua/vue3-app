import { createApp } from 'vue'

import router from './router'
import store from './store'

import App from './App.vue'

import './styles/base.scss'
import './utils/mrem'

let instance = createApp(App)
instance.use(router)
instance.use(store)
instance.mount('#app')

