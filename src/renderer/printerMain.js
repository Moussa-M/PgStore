import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
window.$ = window.jQuery = require('jquery');
import InvoiceTemplate from '@/components/InvoiceTemplate.vue';
window.moment = require('moment');
window._ = require('lodash');
import i18n from './i18n'
Vue.config.productionTip = false

const router = new VueRouter({
    routes: [{
            path: '/',
            redirect: '/invoice_template/start',
        },
        {
            path: '/invoice_template/:id',
            name: 'open_invoice_template',
            component: InvoiceTemplate,
            props: true
        }
    ]
})
Vue.use(VueRouter)
Vue.prototype.$eventBus = new Vue();
new Vue({
    el: "#app",
    router,
    i18n,
    render: h => h(App),
}).$mount('#app')