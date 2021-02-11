import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'
import ErrorPanel from './components/sub_components/ErrorPanel.vue'

import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {
    faCoffee,
    faUser,
    faUserAlt,
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
    faUsers,
    faBarcode,
    faPlus,
    faMinus,
    faCartPlus,
    faSearch,
    faBoxes,
    faFileInvoice,
    faTruckLoading,
    faPallet,
    faUsersCog
} from '@fortawesome/free-solid-svg-icons'
import {
    FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

import Grid from 'vue-js-grid'

Vue.use(Grid)

import "vue-material-design-icons/styles.css"
import VueBarcode from '@chenfengyuan/vue-barcode';
Vue.component(VueBarcode.name, VueBarcode);
//require('vue2-simplert/dist/simplert.css')

import VueSwal from 'vue-swal'

Vue.use(VueSwal)

import VTooltip from 'v-tooltip'

Vue.use(VTooltip)

import '@mdi/font/css/materialdesignicons.min.css'
import colors from 'vuetify/es5/util/colors'
import Vuetify, {
    VApp, // required
    VSnackbar,
    VMenu,
    VCombobox,
    VBadge,
    VChip,
    VSelect,
    VListTile,
    VListTileSubTitle,
    VListTileAction,
    VListTileContent,
    VListTileTitle,
    VDivider,
    VAvatar,
    VAutocomplete,
    VTextField,
    VForm,
    VBtn,
    VAlert,
    VContainer,
    VContent,
    VIcon,
    VDatePicker,
    VList,
    VCheckbox,
    VTimePicker
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'
import 'vuetify/dist/vuetify.min.css'


Vue.use(Vuetify, {
    iconfont: 'mdi',

    theme: {
        primary: colors.yellow.darken1, // #E53935
        secondary: colors.yellow.lighten4, // #FFCDD2
        accent: colors.yellow.base, // #3F51B5
        error: colors.red.accent3
    },
    components: {
        VApp,
        VSnackbar,
        VMenu,
        VCombobox,
        VBadge,
        VListTile,

        VListTileSubTitle,
        VListTileTitle,
        VListTileAction,
        VListTileContent,
        VDivider,
        VAvatar,
        VChip,
        VSelect,
        VAutocomplete,
        VTextField,
        VForm,
        VBtn,
        VAlert,
        VContainer,
        VContent,
        VIcon,
        VDatePicker,
        VList,
        VCheckbox,
        VTimePicker
    },
    directives: {
        Ripple
    }
})

const uuid4 = require('uuid/v4');
window.uuid = uuid4;
window.store = store
window._ = require('lodash')
window.$ = window.jQuery = require('jquery')
window.moment = require('moment')
window.twix = require('twix')
import "electron-titlebar/titlebar/titlebar.css"
require('electron-titlebar')

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faSearch, faCoffee, faSignInAlt, faEye, faEyeSlash, faSignOutAlt, faClipboardCheck, faUsersCog, faUser, faUserAlt,
    faCircleNotch, faTrash, faPrint, faFilter, faUsers, faCircle, faBarcode, faPlus, faMinus, faCartPlus, faBoxes, faFileInvoice, faTruckLoading,
    faPallet)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
window.axios = axios;
Vue.prototype.$eventBus = new Vue()


/* eslint-disable no-new */


//filters

const currencyFilter = function(value) {
    return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

require('./components/helpers')
Vue.component('ErrorPanel', ErrorPanel);
Vue.filter('currency', currencyFilter);
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

require('bootstrap');

require("./event_listeners.js")