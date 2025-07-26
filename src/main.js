import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import "@/utils/options"
import '@/utils/request'
import '@/utils/dic'
import i18n from './i18n/index';
import JsonViewer from 'vue-json-viewer'

import Pagination from "@/components/Pagination";
import Eletable from "@/components/Table";
import RightToolbar from "@/components/RightToolbar";
import Print from 'vue-print-nb'

import '@/icons' // icon
import '@/permission' // permission control
Vue.component("Table", Eletable)
Vue.component("Pagination", Pagination)
Vue.component("RightToolbar", RightToolbar);
Vue.use(Print);
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
console.log(i18n)
// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n:(key, value) => i18n.t(key, value)
})
Vue.use(JsonViewer);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n, //很重要，别忘记
  render: h => h(App)
})
