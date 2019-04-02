import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faCoffee,
  faSignInAlt,
  faSignOutAlt,
  faEye,
  faCircle,
  faEyeSlash,
  faPrint,
  faClipboardCheck,
  faCircleNotch,
  faTrash,
  faFilter,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'


window.store = store
window._ = require('lodash')
window.$ = window.jQuery = require('jquery')
window.moment = require('moment')
require('electron-titlebar')

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faCoffee, faSignInAlt, faEye, faEyeSlash, faSignOutAlt, faClipboardCheck, faCircleNotch, faTrash, faPrint, faFilter, faUsers, faCircle)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$eventBus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

require('./assets/js/bootstrap.min.js')